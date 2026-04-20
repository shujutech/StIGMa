import { useEffect, useState } from 'react';
import { StigmaForm } from './components/StigmaForm';
import type { StigmaEnvelope, StigmaObject } from './types/stigma';

export default function App() {
  const [data, setData] = useState<StigmaEnvelope | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState<StigmaObject | null>(null);

  useEffect(() => {
    fetch('/sample-data.json')
      .then((r) => r.json() as Promise<StigmaEnvelope>)
      .then(setData)
      .catch((e) => console.error('failed to load sample-data.json', e));
  }, []);

  if (!data) {
    return (
      <div className="p-6 text-sm text-gray-600 italic">Loading sample data…</div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="px-4 md:px-8 py-4 border-b bg-white/60">
        <h1 className="text-lg md:text-xl font-bold text-gray-700">StIGMa React — Demo</h1>
        <p className="text-xs text-gray-500">
          Recursive form rendered from a StIGMa JSON envelope. Same data model as the original vanilla JS framework.
        </p>
      </header>
      <main className="max-w-[1200px] mx-auto">
        <StigmaForm
          data={data}
          title="Product Description"
          onSave={(d) => {
            setSavedSnapshot(d);
            console.info('onSave', d);
          }}
          onCancel={() => console.info('onCancel')}
        />
        {savedSnapshot ? (
          <details className="px-4 md:px-8 my-4 text-xs">
            <summary className="cursor-pointer font-semibold">Last save payload</summary>
            <pre className="bg-gray-900 text-gray-100 p-3 rounded mt-2 overflow-auto max-h-96">
              {JSON.stringify(savedSnapshot, null, 2)}
            </pre>
          </details>
        ) : null}
      </main>
    </div>
  );
}
