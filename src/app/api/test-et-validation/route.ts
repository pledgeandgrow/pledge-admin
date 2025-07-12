import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

// Create Supabase client
const supabase = createClient();

// Helper function to get tests with check items
async function getTests() {
  try {
    // Get all tests
    const { data: tests, error: testsError } = await supabase
      .from('tests')
      .select('*')
      .order('created_at', { ascending: false });

    if (testsError) throw testsError;

    // Get all check items
    const { data: checkItems, error: checkItemsError } = await supabase
      .from('test_check_items')
      .select('*');

    if (checkItemsError) throw checkItemsError;

    // Map check items to their respective tests
    const testsWithCheckItems = tests.map(test => {
      const testCheckItems = checkItems.filter(item => item.test_id === test.id);
      return {
        ...test,
        check_items: testCheckItems
      };
    });

    return testsWithCheckItems;
  } catch (error) {
    console.error("Error fetching tests:", error);
    throw error;
  }
}

export async function GET() {
  try {
    const tests = await getTests();
    return NextResponse.json(tests);
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: "Failed to fetch tests" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Create new test
    const now = new Date().toISOString();
    const { data: test, error: testError } = await supabase
      .from('tests')
      .insert({
        title: body.title,
        description: body.description || null,
        status: body.status || 'pending',
        priority: body.priority || 'medium',
        project_id: body.project_id || null,
        project_name: body.project_name || null,
        due_date: body.due_date || null,
        created_at: now,
        updated_at: now
      })
      .select()
      .single();

    if (testError) throw testError;

    // Define interface for check items
    interface CheckItem {
      description: string;
      is_completed?: boolean;
      created_at?: string;
    }

    // Insert check items if provided
    if (body.check_items && body.check_items.length > 0 && test) {
      const checkItemsToInsert = body.check_items.map((item: CheckItem) => ({
        test_id: test.id,
        description: item.description,
        is_completed: item.is_completed || false,
        created_at: now
      }));

      const { error: checkItemsError } = await supabase
        .from('test_check_items')
        .insert(checkItemsToInsert);

      if (checkItemsError) throw checkItemsError;
    }

    // Get the complete test with check items
    const completeTest = await getTests().then(tests => 
      tests.find(t => t.id === test.id)
    );

    return NextResponse.json(completeTest || test);
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Failed to create test" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Test ID is required" },
        { status: 400 }
      );
    }

    // Update the test
    const { error: testError } = await supabase
      .from('tests')
      .update({
        title: body.title,
        description: body.description,
        status: body.status,
        priority: body.priority,
        project_id: body.project_id || null,
        project_name: body.project_name || null,
        due_date: body.due_date || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (testError) throw testError;

    // Update check items if provided
    if (body.check_items) {
      // Delete existing check items
      const { error: deleteError } = await supabase
        .from('test_check_items')
        .delete()
        .eq('test_id', id);

      if (deleteError) throw deleteError;

      // Insert updated check items
      if (body.check_items.length > 0) {
        // Reuse the CheckItem interface defined earlier
        interface CheckItem {
          description: string;
          is_completed?: boolean;
          created_at?: string;
        }
        
        const checkItemsToInsert = body.check_items.map((item: CheckItem) => ({
          test_id: id,
          description: item.description,
          is_completed: item.is_completed || false,
          created_at: item.created_at || new Date().toISOString()
        }));

        const { error: checkItemsError } = await supabase
          .from('test_check_items')
          .insert(checkItemsToInsert);

        if (checkItemsError) throw checkItemsError;
      }
    }

    // Get the updated test with check items
    const updatedTest = await getTests().then(tests => 
      tests.find(t => t.id === id)
    );

    return NextResponse.json(updatedTest || { id });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Failed to update test" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Test ID is required" },
        { status: 400 }
      );
    }

    // Delete check items first (due to foreign key constraints)
    const { error: checkItemsError } = await supabase
      .from('test_check_items')
      .delete()
      .eq('test_id', id);

    if (checkItemsError) throw checkItemsError;

    // Delete the test
    const { error: testError } = await supabase
      .from('tests')
      .delete()
      .eq('id', id);

    if (testError) throw testError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Failed to delete test" },
      { status: 500 }
    );
  }
}
