import { useState } from "react";
import { useEffect } from "react";
import axios from "../Axios/axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import ExtractedPdf from "./ExtractedPdf";

// eslint-disable-next-line react/prop-types
function NewPdf({ onExtract }) {
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [isPreviewOpen, setPreviewOpen] = useState(false);

  const userId = useSelector((state) => state.user.userData.payload._id);

  const fetchAllPdf = async () => {
    try {
      const response = await axios.get(`/${userId}/getallExtracted`);
      if (response.data.status === true) {
        setPdfs(response.data.ExtractedpdfList.reverse());
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchAllPdf();
  }, [userId, onExtract]);

  const handleDelete = (pdfId) => {
    axios.delete(`/deletepdf/${pdfId}`).then((response) => {
      toast.info(response.data.message);
      fetchAllPdf();
    });
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  const handleShowPdf = (pdf) => {
    setSelectedPdf(`http://localhost:3000/files/${pdf.url}`);
    setPreviewOpen(true);
  };

  const handleDownload = async (pdf) => {
    try {
      const response = await axios({
        url: `http://localhost:3000/files/${pdf.url}`,
        method: 'GET',
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
  
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.download = pdf.title.endsWith('.pdf') ? pdf.title : `${pdf.title}.pdf`; 
      document.body.appendChild(downloadLink);
      downloadLink.click();
  
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to initiate download. Please try again.');
    }
  };
  

  return (
    
    <div className="min-h-[470px] w-full md:w-1/2 lg:w-1/3 xl:w-1/4 m-2 bg-gray-300 rounded-lg shadow-lg p-4 ">
      <div className=" ">

      <div className=" ml-8  bg-white rounded-lg shadow-md p-4 mb-4">
      <h1 className="text-sm sm:text-lg md:text-2xl lg:text-2xl xl:text-xl font-serif font-medium">Your Extracted PDF</h1>
      </div>
      </div>
      <div className="pdf-container overflow-y-auto max-h-[470px]">
      {pdfs.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <h1 className="text-2xl font-serif font-medium">No Extracted PDF</h1>

          <img
            src="/public/assets/extracted.png"
            className="w-40 h-40"
            alt="Add New PDF"
          />
        </div>
      ) : (
        <div className="flex flex-wrap justify-center">
          {pdfs.map((pdf, index) => (
            <div
              key={index}
              className="bg-white  shadow-xl rounded-xl border border-gray-300 hover:border-2 border-gray-300 m-2  relative  max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
            >
              <div className="mb-3">
                <button
                  className="absolute top-1 right-1 "
                  onClick={() => handleDelete(pdf._id)}
                >
                  <img
                    src="/public/assets/delete.png"
                    className="w-4 h-4"
                    alt=""
                  />
                </button>
              </div>
              <div className="bg-custom-background w-40 h-auto rounded-md shadow-sm flex flex-col items-center justify-center text-center">
                <h1 className="font-semibold font-serif text-sm mt-3 font-medium break-words max-w-full">
                  {pdf.title}
                </h1>
                <img
                  src="/public/assets/extractedpdf.png"
                  alt=""
                  className="h-24 w-24 mt-2 relative"
                />
                <div className="flex space-x-4 mt-2 mb-2">
                  <button
                  onClick={() => handleDownload(pdf)}
                  className="bg-blue-800 text-white px-2 rounded-md block font-roboto text-sm">
                    Download
                  </button>
                  <button
                    className="bg-green-500 text-white px-2 rounded-md block font-roboto text-sm"
                    onClick={() => handleShowPdf(pdf)}
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>


      {isPreviewOpen && (
        <ExtractedPdf pdfFile={selectedPdf} onClose={handleClosePreview} />
      )}
    </div>
  );
}

export default NewPdf;
