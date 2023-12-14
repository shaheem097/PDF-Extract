import { pdfjs } from 'react-pdf';
import { useState } from 'react';
import { Document, Page } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
  ).toString();
  

// eslint-disable-next-line react/prop-types
function ExtractedPdf({ pdfFile, onClose }) {

    const [numPages, setNumPages] = useState();

    function onDocumentLoadSuccess({ numPages, error }) {
        if (error) {
          console.error('Error loading PDF:', error);
        } else {
          setNumPages(numPages);
        }
      }
  return (
    <div className="pdf-preview-backdrop" onClick={onClose}>
        
      <div className="pdf-preview-content " onClick={(e) => e.stopPropagation()}>
      

        <Document
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => console.error('PDF load error:', error)}
        >
          {Array.apply(null, Array(numPages)).map((x, i) => i + 1).map((page) => {
            return (
              <div key={page} className="page-container">
               <div className="page-controls">
                  <label>
                   
                    Page {page} of {numPages}
                  </label>
                </div>
                <Page
                  pageNumber={page}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </div>
            );
          })}
        </Document>
       
      </div>
    </div>
  )
}

export default ExtractedPdf
