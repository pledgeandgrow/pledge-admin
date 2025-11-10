# React Hook Best Practices - Preventing Infinite Loops

## 🚨 Root Causes of Infinite Loading

### 1. **Object/Array Dependencies in useEffect**
```typescript
// ❌ BAD - Object reference changes on every render
useEffect(() => {
  fetchData(options?.initialFilters);
}, [options?.initialFilters]); // This object is recreated every render!

// ✅ GOOD - Depend on primitive values
useEffect(() => {
  fetchData({
    status: options?.initialFilters?.status,
    orderBy: options?.initialFilters?.orderBy,
  });
}, [
  options?.initialFilters?.status,
  options?.initialFilters?.orderBy,
]);
```

### 2. **useCallback with Object Dependencies**
```typescript
// ❌ BAD - Callback recreated on every render
const fetchData = useCallback(async (filters) => {
  // ... fetch logic
}, [options?.initialFilters]); // Object dependency!

// ✅ GOOD - No object dependencies
const fetchData = useCallback(async (filters) => {
  // ... fetch logic
}, [supabase]); // Only stable references
```

### 3. **useEffect Depending on Unstable Callbacks**
```typescript
// ❌ BAD - fetchData changes, triggers useEffect, which calls fetchData, repeat...
const fetchData = useCallback(async () => {
  // ...
}, [filters]); // filters is an object

useEffect(() => {
  fetchData();
}, [fetchData]); // Infinite loop!

// ✅ GOOD - Stable callback or no dependency
const fetchData = useCallback(async () => {
  // ...
}, []); // No dependencies

useEffect(() => {
  fetchData();
}, []); // Only run once
```

## ✅ Proven Patterns That Work

### Pattern 1: Extract Primitives from Options
```typescript
export const useMyHook = (options?: MyOptions) => {
  const fetchData = useCallback(async (filters?: Filters) => {
    // Use filters parameter, not options
    const mergedFilters = filters || {};
    // ... fetch logic
  }, [supabase]); // Only stable dependencies

  useEffect(() => {
    if (options?.autoFetch !== false) {
      // Extract primitives from options
      const initialFilter: Filters = {};
      if (options?.initialFilters?.status) {
        initialFilter.status = options.initialFilters.status;
      }
      if (options?.initialFilters?.orderBy) {
        initialFilter.orderBy = options.initialFilters.orderBy;
      }
      fetchData(initialFilter);
    }
  }, [
    // Depend on primitives only
    options?.initialFilters?.status,
    options?.initialFilters?.orderBy,
    options?.autoFetch,
  ]);
};
```

### Pattern 2: Simple autoFetch Flag
```typescript
export const useMyHook = (autoFetch = true) => {
  const fetchData = useCallback(async () => {
    // ... fetch logic
  }, [supabase]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]); // fetchData is stable
};
```

### Pattern 3: Empty Dependency Array (One-time Fetch)
```typescript
export const useMyHook = () => {
  const fetchData = useCallback(async () => {
    // ... fetch logic
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, []); // Only run once on mount
};
```

## 🔍 How to Audit Your Hooks

### Checklist:
1. ✅ **Check useCallback dependencies**
   - Are there any object or array dependencies?
   - Can they be removed or replaced with primitives?

2. ✅ **Check useEffect dependencies**
   - Are there any object or array dependencies?
   - Are callbacks in dependencies stable?

3. ✅ **Test for infinite loops**
   - Add a console.log in useEffect
   - If it logs continuously, you have an infinite loop

4. ✅ **Use React DevTools Profiler**
   - Check if component re-renders excessively
   - Look for callbacks being recreated

## 🛠️ Quick Fixes

### Fix 1: Remove Object Dependencies
```typescript
// Before
const fetchData = useCallback(async (filters) => {
  // ...
}, [options?.initialFilters]); // ❌

// After
const fetchData = useCallback(async (filters) => {
  // ...
}, [supabase]); // ✅
```

### Fix 2: Extract Primitives in useEffect
```typescript
// Before
useEffect(() => {
  fetchData(options?.initialFilters);
}, [options?.initialFilters]); // ❌

// After
useEffect(() => {
  const filter = {
    status: options?.initialFilters?.status,
    orderBy: options?.initialFilters?.orderBy,
  };
  fetchData(filter);
}, [
  options?.initialFilters?.status,
  options?.initialFilters?.orderBy,
]); // ✅
```

### Fix 3: Use Refs for Complex Objects
```typescript
const filtersRef = useRef(filters);

useEffect(() => {
  filtersRef.current = filters;
}, [filters]);

const fetchData = useCallback(async () => {
  // Use filtersRef.current instead of filters
  const currentFilters = filtersRef.current;
  // ...
}, []); // No dependencies needed
```

## 📋 Examples from Our Codebase

### ✅ Good Examples:
- `useClients` - Fixed with primitive dependencies
- `useLeads` - Fixed with primitive dependencies
- `useContacts` - Uses type primitive
- `useProducts` - Simple autoFetch pattern
- `useAssets` - Simple autoFetch pattern

### ⚠️ Patterns to Watch:
- Any hook with `options?.initialFilters` in dependencies
- Any hook with complex filter objects
- Any hook with nested object access in useEffect

## 🎯 Golden Rules

1. **Never put objects or arrays directly in dependency arrays**
2. **Extract primitive values before using in dependencies**
3. **Keep useCallback dependencies minimal and stable**
4. **Test with React StrictMode enabled (double-renders)**
5. **Use ESLint react-hooks/exhaustive-deps rule**

## 🚀 Prevention Strategy

### For New Hooks:
1. Start with empty dependency arrays
2. Add dependencies one at a time
3. Test after each addition
4. If adding an object, extract primitives instead

### For Existing Hooks:
1. Search for `useEffect` and `useCallback`
2. Check all dependency arrays
3. Look for object/array dependencies
4. Refactor to use primitives

## 📚 Additional Resources

- [React Hooks Documentation](https://react.dev/reference/react)
- [useEffect Complete Guide](https://overreacted.io/a-complete-guide-to-useeffect/)
- [React Hook Flow Diagram](https://github.com/donavon/hook-flow)
