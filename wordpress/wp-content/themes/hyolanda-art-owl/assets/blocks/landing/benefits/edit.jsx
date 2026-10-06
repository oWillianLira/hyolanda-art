const { RichText, InnerBlocks } = wp.blockEditor;

export default function Edit({ attributes, setAttributes }) {
  const { title, description } = attributes;

  return (
    <section className="hyo-benefits">
      <RichText
        tagName="h2"
        value={title}
        onChange={(value) =>
          setAttributes({
            title: value,
          })
        }
        placeholder="Section title..."
      />

      <RichText
        tagName="p"
        value={description}
        onChange={(value) =>
          setAttributes({
            description: value,
          })
        }
        placeholder="Section description..."
      />

      <div className="hyo-benefits-grid">
        <InnerBlocks allowedBlocks={['hyo/benefits-item']} />
      </div>
    </section>
  );
}
