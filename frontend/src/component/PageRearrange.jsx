// PageRearrange.js
import  { useState } from "react";
import { toast } from "react-toastify";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { PDFDocument } from "pdf-lib";
import { useSelector } from "react-redux";
import axios from "../Axios/axios";

// ... (existing imports)

// eslint-disable-next-line react/prop-types
function PageRearrange({ onClose, extractedPages,pdfHeading,previewclose }) {

     const userId = useSelector((state) => state.user.userData.payload._id); 

    const [pages, setPages] = useState(extractedPages);

  const handleCancel = () => {
    onClose();
  };

  const pageHeightandWidth={
    width: 612, // Assuming a standard letter width in points (replace with your actual value)
    height: 792,
  }

  const handleContinue = async () => {
    try {
      // Combine pages in the new order into a new PDF
      const pdfDoc = await PDFDocument.create();
      const copiedPages = await Promise.all(
        pages.map(async (extractedPage) => {
          const copiedPage = await pdfDoc.addPage([
            pageHeightandWidth.width,
            pageHeightandWidth.height,
          ]);
          const { content } = extractedPage;
          const base64String = content.split(',')[1];
          const bytes = Uint8Array.from(atob(base64String), (c) =>
            c.charCodeAt(0)
          );
          const image = await pdfDoc.embedPng(bytes);
  
          // Resize the image to fit within the page
          const maxWidth = pageHeightandWidth.width - 100; // Adjust as needed
          const maxHeight = pageHeightandWidth.height - 100; // Adjust as needed
          const scaleFactor = Math.min(
            maxWidth / image.width,
            maxHeight / image.height
          );
  
          copiedPage.drawImage(image, {
            x: 50,
            y: copiedPage.getHeight() - 50 - image.height * scaleFactor,
            width: image.width * scaleFactor,
            height: image.height * scaleFactor,
          });
  
          return copiedPage;
        })
      );
  
      // Convert the PDF to a Uint8Array
      const pdfBytes = await pdfDoc.save();
  
      // Create a new Blob and FormData
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const formData = new FormData();
      formData.append('file', blob, `${pdfHeading}.extracted.pdf`);
      formData.append('title', `${pdfHeading}.extracted`);
      formData.append('userId', userId);
      formData.append('Extracted', true);
  
      // Call the upload API or perform other actions with the new PDF
      const response = await axios.post('/uploadpdf', formData);
  
      if (response.data.status === true) {
        console.log('Upload successful:', response.data);
        toast.success('New PDF Created')
        previewclose()
        onClose();
      } else {
        console.log('Error in upload');
      }
    } catch (error) {
      console.error('Error processing PDF and uploading:', error.message);
    }
  };
  
  const movePage = (dragIndex, hoverIndex) => {
    const dragPage = pages[dragIndex];
    const updatedPages = [...pages];
    updatedPages.splice(dragIndex, 1);
    updatedPages.splice(hoverIndex, 0, dragPage);
    setPages(updatedPages);
  };

  // eslint-disable-next-line react/prop-types
  const PageDraggable = ({ index, content, originalOrder }) => {
    const [, ref] = useDrag({
      type: "page",
      item: { index },
    });
  
    const [, drop] = useDrop({
      accept: "page",
      hover: (item) => {
        if (item.index !== index) {
          movePage(item.index, index);
          item.index = index;
        }
      },
    });

   
  
    return (
      <>
        <div
          key={originalOrder}
          ref={(node) => ref(drop(node))}
          className="border-black border rounded-md relative "
          style={{
            width: "150px",
            height: "200px",
            margin: "3px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop:'20px',
            cursor:"pointer"
          }}
        >
          <img
            src={content}
            alt={`Page ${originalOrder + 1}`}
            style={{ maxWidth: "100%", maxHeight: "80%", borderRadius: "5px" }}
          />
          <h2 className="absolute bottom-full left-1/2 transform -translate-x-1/2 mt-2 text-sm">
            {`Page ${originalOrder + 1}`}
          </h2>
        </div>
      </>

    );
  };

  return (
    <div>
      <div
        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50"
        onClick={onClose}
      />

      <DndProvider backend={HTML5Backend}>
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-screen w-3/4 rounded-lg shadow bg-white p-4 overflow-y-auto">
          <div className="flex justify-between mt-4 absolute top-0 left-0 w-full p-4">
            <button
              onClick={handleCancel}
              className="bg-red-500 text-white py-2 px-4 rounded-md block font-roboto text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              className="bg-blue-500 text-white py-2 px-4 rounded-md block font-roboto text-sm"
            >
              Continue
            </button>
          </div>
          <div className="h-[60px]  text-center ">
            <h1 className="text-xs md:text-2xl lg:text-xl xl:text-2xl font-serif p-4">
              Drag and Re-arrange your page
            </h1>
          </div>

          <div className="m-2 border-black border h-auto min-h-full rounded-lg">
            <div className="flex flex-wrap gap-3 justify-center">
              {pages.map((extractedPage, index) => (
                <>
                  <PageDraggable
                    key={extractedPage.page}
                    index={index}
                    content={extractedPage.content}
                    originalOrder={index}
                  />
                </>
              ))}
            </div>
          </div>
        </div>
      </DndProvider>
    </div>
  );
}

export default PageRearrange;
