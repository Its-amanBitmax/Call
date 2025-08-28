import { useState, createContext, useContext, useRef, useEffect } from 'react';

const DropdownContext = createContext();

export default function Dropdown({ children }) {
    const [open, setOpen] = useState(false);

    const toggleOpen = () => {
        setOpen((previousState) => !previousState);
    };

    return (
        <DropdownContext.Provider value={{ open, setOpen, toggleOpen }}>
            <div className="relative">{children}</div>
        </DropdownContext.Provider>
    );
}

const DropdownTrigger = ({ children }) => {
    const { open, setOpen, toggleOpen } = useContext(DropdownContext);

    return (
        <>
            <div onClick={toggleOpen}>{children}</div>

            {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}></div>}
        </>
    );
};

const DropdownContent = ({ align = 'right', width = '48', contentClasses = 'py-1 bg-white', children }) => {
    const { open, setOpen } = useContext(DropdownContext);
    const [position, setPosition] = useState({});
    const triggerRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        if (open && triggerRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect();
            setPosition({
                top: triggerRect.bottom + window.scrollY,
                left: align === 'right' ? triggerRect.right - (parseInt(width) * 4) : triggerRect.left,
            });
        }
    }, [open, align, width]);

    if (!open) return null;

    return (
        <div
            ref={contentRef}
            className={`absolute z-50 mt-2 rounded-md shadow-lg ${align === 'right' ? 'right-0' : 'left-0'} w-${width} ${contentClasses}`}
            style={{ top: position.top, left: position.left }}
        >
            <div className="rounded-md ring-1 ring-black ring-opacity-5">{children}</div>
        </div>
    );
};

const DropdownLink = ({ href, method = 'get', as = 'a', children, ...props }) => {
    const { setOpen } = useContext(DropdownContext);

    const handleClick = (e) => {
        e.preventDefault();
        setOpen(false);
        
        if (method === 'get') {
            window.location.href = href;
        } else {
            // Use Inertia's form handling for non-GET methods
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = href;
            form.style.display = 'none';
            
            // Add CSRF token
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
            if (csrfToken) {
                const csrfInput = document.createElement('input');
                csrfInput.type = 'hidden';
                csrfInput.name = '_token';
                csrfInput.value = csrfToken;
                form.appendChild(csrfInput);
            }
            
            // Add method spoofing for non-POST methods
            if (method !== 'post') {
                const methodInput = document.createElement('input');
                methodInput.type = 'hidden';
                methodInput.name = '_method';
                methodInput.value = method.toUpperCase();
                form.appendChild(methodInput);
            }
            
            document.body.appendChild(form);
            form.submit();
        }
    };

    return (
        <a
            href={href}
            className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
            onClick={handleClick}
            {...props}
        >
            {children}
        </a>
    );
};

// Attach sub-components to the main Dropdown component
Dropdown.Trigger = DropdownTrigger;
Dropdown.Content = DropdownContent;
Dropdown.Link = DropdownLink;
