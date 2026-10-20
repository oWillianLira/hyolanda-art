const { RichText, useBlockProps } = wp.blockEditor;

export default function Edit({ attributes, setAttributes }) {
  const blockProps = useBlockProps();

  return (
    <section {...blockProps}>
      <div className="landing-billboard__content">
        <RichText
          tagName="h1"
          value={attributes.title}
          onChange={(title) => setAttributes({ title })}
          placeholder="Enter title..."
        />
      </div>
    </section>
  );
}
