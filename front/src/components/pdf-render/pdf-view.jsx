import React, { Suspense } from 'react';

const PdfRender = React.lazy(() => import('./pdf-render'));

export const PdfView = (props) => (
  <div>
    <Suspense fallback={<div>Завантаження...</div>}>
      <PdfRender {...props} />
    </Suspense>
  </div>
);


