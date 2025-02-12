import { useState } from 'react';
import { validateEmail, validatePhone, generateId } from '../utils/dataUtils';

export default function useForm(initialState, validationRules = {}) {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleArrayAdd = (arrayName, newItem, uniqueKey = 'id') => {
    setValues(prev => {
      const currentArray = prev[arrayName] || [];
      
      // Prevent duplicates
      const isDuplicate = currentArray.some(
        item => item[uniqueKey] === newItem[uniqueKey]
      );

      if (isDuplicate) return prev;

      return {
        ...prev,
        [arrayName]: [...currentArray, {
          ...newItem,
          id: generateId()
        }]
      };
    });
  };

  const handleArrayRemove = (arrayName, itemToRemove, uniqueKey = 'id') => {
    setValues(prev => ({
      ...prev,
      [arrayName]: (prev[arrayName] || []).filter(
        item => item[uniqueKey] !== itemToRemove[uniqueKey]
      )
    }));
  };

  const validate = () => {
    const newErrors = {};

    Object.keys(validationRules).forEach(key => {
      const rules = validationRules[key];
      const value = values[key];

      if (rules.required && !value) {
        newErrors[key] = 'Ce champ est obligatoire';
      }

      if (rules.email && value && !validateEmail(value)) {
        newErrors[key] = 'Format d\'email invalide';
      }

      if (rules.phone && value && !validatePhone(value)) {
        newErrors[key] = 'Numéro de téléphone invalide';
      }

      if (rules.minLength && value && value.length < rules.minLength) {
        newErrors[key] = `Minimum ${rules.minLength} caractères requis`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setValues(initialState);
    setErrors({});
  };

  return {
    values,
    errors,
    handleChange,
    handleArrayAdd,
    handleArrayRemove,
    validate,
    reset,
    setValues
  };
}
