import useReveal from "../../hooks/useReveal";

export default function Reveal({ as: Tag = "div", className = "", style, children, delay }) {
  const ref = useReveal();

  return (
    <Tag
      ref={ref}
      className={`reveal is-visible ${className}`}
      style={{ ...(delay ? { transitionDelay: delay } : {}), ...style }}
    >
      {children}
    </Tag>
  );
}