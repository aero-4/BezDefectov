import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Tooltip({
                                    children,
                                    content,
                                    placement = 'top', // 'top' | 'bottom' | 'left' | 'right'
                                    delay = 100, // ms before showing
                                    offset = 8, // px between trigger and tooltip
                                    className = '',
                                    open: controlledOpen,
                                    onOpenChange,
                                }) {
    const triggerRef = useRef(null);
    const tipRef = useRef(null);
    const showTimeout = useRef(null);
    const hideTimeout = useRef(null);
    const portalEl = useRef(null);
    const idRef = useRef('tooltip-' + Math.random().toString(36).slice(2, 9));

    const [open, setOpen] = useState(false);
    const isControlled = typeof controlledOpen === 'boolean';

    useEffect(() => {
        if (!portalEl.current) {
            portalEl.current = document.createElement('div');
            document.body.appendChild(portalEl.current);
        }
        return () => {
            if (portalEl.current) {
                try { document.body.removeChild(portalEl.current); } catch {}
            }
        };
    }, []);

    useEffect(() => {
        if (isControlled) setOpen(!!controlledOpen);
    }, [controlledOpen]);

    useEffect(() => {
        if (!open) return;
        const update = () => positionTooltip();
        window.addEventListener('scroll', update, true);
        window.addEventListener('resize', update);
        return () => {
            window.removeEventListener('scroll', update, true);
            window.removeEventListener('resize', update);
        };
    }, [open, placement]);

    function positionTooltip() {
        const trigger = triggerRef.current;
        const tip = tipRef.current;
        if (!trigger || !tip) return;

        const rect = trigger.getBoundingClientRect();
        const tipRect = tip.getBoundingClientRect();

        let top = 0;
        let left = 0;

        if (placement === 'top') {
            top = rect.top - tipRect.height - offset;
            left = rect.left + (rect.width - tipRect.width) / 2;
        } else if (placement === 'bottom') {
            top = rect.bottom + offset;
            left = rect.left + (rect.width - tipRect.width) / 2;
        } else if (placement === 'left') {
            top = rect.top + (rect.height - tipRect.height) / 2;
            left = rect.left - tipRect.width - offset;
        } else if (placement === 'right') {
            top = rect.top + (rect.height - tipRect.height) / 2;
            left = rect.right + offset;
        }

        const margin = 8;
        left = Math.max(margin, Math.min(left, window.innerWidth - tipRect.width - margin));
        top = Math.max(margin, Math.min(top, window.innerHeight - tipRect.height - margin));

        tip.style.top = Math.round(top + window.scrollY) + 'px';
        tip.style.left = Math.round(left + window.scrollX) + 'px';
    }

    function showImmediate() {
        if (showTimeout.current) clearTimeout(showTimeout.current);
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
        showTimeout.current = setTimeout(() => {
            if (!isControlled) setOpen(true);
            onOpenChange?.(true);
            positionTooltip();
        }, delay);
    }

    function hideImmediate() {
        if (showTimeout.current) clearTimeout(showTimeout.current);
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
        hideTimeout.current = setTimeout(() => {
            if (!isControlled) setOpen(false);
            onOpenChange?.(false);
        }, 50);
    }

    function handleFocus() {
        showImmediate();
    }
    function handleBlur() {
        hideImmediate();
    }

    function handleTouchStart(e) {
        e.stopPropagation();
        if (open) hideImmediate();
        else showImmediate();
    }

    const trigger = React.cloneElement(
        React.Children.only(children),
        {
            ref: (node) => {
                triggerRef.current = node;
                const { ref } = children;
                if (typeof ref === 'function') ref(node);
                else if (ref && typeof ref === 'object') ref.current = node;
            },
            onMouseEnter: (e) => {
                children.props.onMouseEnter?.(e);
                showImmediate();
            },
            onMouseLeave: (e) => {
                children.props.onMouseLeave?.(e);
                hideImmediate();
            },
            onFocus: (e) => {
                children.props.onFocus?.(e);
                handleFocus();
            },
            onBlur: (e) => {
                children.props.onBlur?.(e);
                handleBlur();
            },
            onTouchStart: (e) => {
                children.props.onTouchStart?.(e);
                handleTouchStart(e);
            },
            'aria-describedby': open ? idRef.current : undefined,
        }
    );

    const tooltipNode = (
        <div
            ref={tipRef}
            id={idRef.current}
            role="tooltip"
            className={`pointer-events-none fixed z-50 transform transition-opacity duration-150 ${open ? 'opacity-100' : 'opacity-0'} ${className}`}
            style={{ top: 0, left: 0 }}
            aria-hidden={!open}
        >
            <div className="inline-block select-none whitespace-normal max-w-xs text-sm px-3 py-1.5 rounded-2xl shadow-lg bg-slate-800 text-white">
                {content}
            </div>
            <div
                aria-hidden
                className="absolute w-3 h-3 rotate-45 bg-slate-800"
                style={{
                    top: placement === 'bottom' ? -6 : placement === 'top' ? 'auto' : '50%',
                    bottom: placement === 'top' ? -6 : 'auto',
                    left: placement === 'left' ? '100%' : placement === 'right' ? -6 : '50%',
                    transform: placement === 'left' || placement === 'right' ? 'translateY(-50%)' : 'translateX(-50%)',
                }}
            />
        </div>
    );

    return (
        <>
            {trigger}
            {portalEl.current ? createPortal(tooltipNode, portalEl.current) : null}
        </>
    );
}
