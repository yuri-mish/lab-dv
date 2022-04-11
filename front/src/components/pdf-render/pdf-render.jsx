import { useState } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import PropTypes from 'prop-types';

const PdfRender = (props) => {
  const [ numPages, setNumPages ] = useState(1);

  const onDocumentLoadSuccess = (e) => {
    setNumPages(e.numPages);
  };

  return (
    <>
      <Document
        file={props.file}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {
          Array.from(
            new Array(numPages),
            (_, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={props.width ?? 1000}
              />
            ),
          )
        }
      </Document>
    </>
  );
};

export default PdfRender;

PdfRender.propTypes = {
  file: PropTypes.string.isRequired,
  width: PropTypes.number,
};

