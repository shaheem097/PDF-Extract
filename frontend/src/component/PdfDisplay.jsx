import { useState } from "react";
import { toast } from "react-toastify";
import PdfUploadModal from "./pdfUploadModal";
import { useEffect } from "react";
import axios from "../Axios/axios";
import { useSelector } from "react-redux";
import PdfPreview from "./PdfPreview";
import NewPdf from "./NewPdf";

function PdfDisplay() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [selectedPdfHeading, setSelectedPdfHeading] = useState(null);
  const [isPreviewOpen, setPreviewOpen] = useState(false);

  const userId = useSelector((state) => state.user.userData.payload._id);
  const fetchAllPdf = async () => {
    try {
      const response = await axios.get(`/${userId}/getallpdf`);
      if (response.data.status === true) {
        setPdfs(response.data.pdfList.reverse());
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchAllPdf();
  }, [userId, isModalOpen,]);

  // Function to handle delete
  const handleDelete = (pdfId) => {

    axios.delete(`/deletepdf/${pdfId}`).then((response)=>{
        toast.info(response.data.message)
        fetchAllPdf();
    })

  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  const handleShowPdf = (pdf) => {
    setSelectedPdf(`http://localhost:3000/files/${pdf.url}`);
    setSelectedPdfHeading(pdf.title);
    setPreviewOpen(true);
  };

  return (
    <div className="w-screen flex ">
    <div className="max-h-[470px] w-full md:w-1/2 lg:w-3/4 xl:w-3/4 m-2 bg-gray-300 rounded-lg shadow-lg p-4 overflow-y-auto">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-md mb-4 mx-auto block font-roboto text-sm"
          onClick={() => setModalOpen(true)}
        >
          Upload PDF
        </button>

        {/* Render existing PDF cards */}
        {pdfs.length === 0 ? (
          <div className=" h-full">
            <img
              src="/public/assets/addnewpdf.png"
              className="w-80 h-80 ml-80"
              alt="Add New PDF"
            />
            <h1 className="text-2xl font-serif font-medium ml-96">
              No pdf to Display
            </h1>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center">
            {pdfs.map((pdf, index) => (
              <div
                key={index}
                className="bg-white shadow-xl rounded-xl border border-gray-300 hover:border-2 border-gray-300 m-2 relative max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
              >
                {/* Delete icon */}
                <div className="mb-2">
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
                {/* PDF content */}
                <div className="bg-custom-background w-40 h-40 rounded-md shadow-sm items-center justify-center text-center">
                  <h1 className="font-semibold font-serif text-xl  font-medium  break-words">
                    {pdf.title}
                  </h1>
                  <img
                    src="/public/assets/pdfcard.png"
                    alt=""
                    className="h-24 w-24 ml-6 mt-2 relative"
                  />
                  <button
                    className="bg-green-500 text-white ml-10 px-2 rounded-md block font-roboto text-sm"
                    onClick={() => handleShowPdf(pdf)}
                  >
                    Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Render upload modal */}
        <PdfUploadModal
          isOpen={isModalOpen}
          onRequestClose={() => setModalOpen(false)}
        />

        {isPreviewOpen && (
          <PdfPreview
            pdfFile={selectedPdf}
            onClose={handleClosePreview}
            pdfHeading={selectedPdfHeading}
            
          />
        )}
      </div>
      <NewPdf 
      onExtract={isPreviewOpen}
      />
    </div>
  );
}

export default PdfDisplay;
