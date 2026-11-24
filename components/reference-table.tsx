type ReferenceRows = {
  props: readonly (readonly [name: string, type: string, initial: string, detail: string])[];
  keyboard: readonly (readonly [key: string, action: string])[];
};

export function ReferenceTable({ props, keyboard }: ReferenceRows) {
  return (
    <>
      <section id="api">
        <h2>API</h2>
        <div className="component-api-scroll">
          <table className="component-api-table">
            <thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
            <tbody>{props.map(([name, type, initial, detail]) => <tr key={name}><td><code>{name}</code></td><td><code>{type}</code></td><td>{initial === "—" || initial === "–" ? initial : <code>{initial}</code>}</td><td>{detail}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
      {keyboard.length ? <section id="keyboard"><h2>键盘操作</h2><dl className="component-keyboard">{keyboard.map(([key, action]) => <div key={key}><dt><kbd>{key}</kbd></dt><dd>{action}</dd></div>)}</dl></section> : null}
    </>
  );
}
