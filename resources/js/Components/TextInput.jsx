import React from 'react';

const TextInput = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <input
            ref={ref}
            className={`border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm ${className}`}
            {...props}
        />
    );
});

export default TextInput;
