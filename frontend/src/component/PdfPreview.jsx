// PdfPreview.js

import { pdfjs } from 'react-pdf';
import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import PageRearrange from './PageRearrange';



pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

// eslint-disable-next-line react/prop-types
function PdfPreview({ pdfFile, onClose,pdfHeading}) {

  const [numPages, setNumPages] = useState();
  const [selectedPages, setSelectedPages] = useState([]);
  const [showPageRearrange, setShowPageRearrange] = useState(false);
  const [extractedPages, setExtractedPages] = useState([]);


  function onDocumentLoadSuccess({ numPages, error }) {
    if (error) {
      console.error('Error loading PDF:', error);
    } else {
      setNumPages(numPages);
    }
  }

  function handlePageSelection(page) {
    const updatedSelectedPages = selectedPages.includes(page)
      ? selectedPages.filter((selectedPage) => selectedPage !== page)
      : [...selectedPages, page];

    setSelectedPages(updatedSelectedPages);
  }

  function isExtractButtonDisabled() {
    return selectedPages.length === 0;
  }

  function handleExtract() {
    // Extract content of selected pages
    const extractedPages = selectedPages.map((page) => {
      return new Promise((resolve, reject) => {
        // Load the PDF using react-pdf
        pdfjs.getDocument({ url: pdfFile }).promise
          .then((pdf) => {
            // Get the selected page
            pdf.getPage(page).then((pdfPage) => {
              const scale = 2; // Adjust the scale as needed
              const viewport = pdfPage.getViewport({ scale });

              // Create a canvas for rendering
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              canvas.width = viewport.width;
              canvas.height = viewport.height;

              // Render the page to the canvas
              const renderContext = {
                canvasContext: context,
                viewport: viewport,
              };

              pdfPage.render(renderContext).promise.then(() => {
                // Convert the canvas content to an image data URL
                const imageData = canvas.toDataURL('image/png');
                resolve({ page, content: imageData });
              });
            });
          })
          .catch(reject);
      });
    });

    Promise.all(extractedPages).then((results) => {
      setShowPageRearrange(true);
      setExtractedPages(results);
    });
  }



  return (
    <div className="pdf-preview-backdrop z-10" onClick={onClose}>
        
      <div className="pdf-preview-content " onClick={(e) => e.stopPropagation()}>
      <div className="flex">
         
       
        <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md block font-roboto text-sm ml-auto"
            onClick={handleExtract}
           disabled={isExtractButtonDisabled()}
          >
            Extract
          </button>
        </div>

        <Document
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => console.error('PDF load error:', error)}
        >
        {Array.apply(null, Array(numPages)).map((x, i) => i + 1).map((page) => {
  return (
    <div key={page} className="page-container">
      <div className="flex">
        <div>
          <label>
            Page {page} of {numPages}
          </label>
        </div>
        <div className="ml-auto">
          <label>
            Select Page {page}
            <input
              type="checkbox"
              name={`pageSelector${page}`}
              checked={selectedPages.includes(page)}
              onChange={() => handlePageSelection(page)}
            />
          </label>
        </div>
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

        {showPageRearrange && (
          <PageRearrange
            onClose={() => setShowPageRearrange(false)}
            extractedPages={extractedPages} 
            pdfHeading={pdfHeading}
            previewclose={onClose}
            />
        )}
       
      </div>
    </div>
  );
}

export default PdfPreview;
