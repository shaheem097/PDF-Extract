import { useState } from 'react';
import Modal from 'react-modal';
import axios from '../Axios/axios';
import { useSelector } from 'react-redux';

// eslint-disable-next-line react/prop-types
const PdfUploadModal = ({ isOpen, onRequestClose }) => {
  const [pdfHeading, setPdfHeading] = useState('');
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [pdfValidationError, setPdfValidationError] = useState('');
  const userId = useSelector((state) => state.user.userData.payload._id);

  const handlePdfHeadingChange = (e) => {
    const inputHeading = e.target.value;

    if (inputHeading.trim().length <= 12) {
      setPdfHeading(inputHeading);
      setValidationError('');
    } else {
      setValidationError('Heading must be at most 12 characters');
    }
  };

  const closeModal=()=>{
    setSelectedPdf(null)
    setPdfHeading('')
    onRequestClose()
  }
  const handlePdfFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const allowedExtensions = /(\.pdf)$/i;

      if (!allowedExtensions.exec(file.name)) {
        setPdfValidationError('Only PDF files are allowed');
      } else {
        setSelectedPdf(file);
        setValidationError('');
        setPdfValidationError('')

      }
    }
  };

  const handleUpload = async () => {
    try {
      if (!pdfHeading.trim()) {
        setValidationError('Heading cannot be empty');
        return;
      }

      if (!selectedPdf) {
        setPdfValidationError('Please select a PDF file');
        return;
      }
      const Extracted=false
      const formData = new FormData();
      formData.append('file', selectedPdf);
      formData.append('title', pdfHeading);
      formData.append('userId', userId);
      formData.append('Extracted',Extracted)

      const response = await axios.post('/uploadpdf', formData);

      if (response.data.status === true) {
        console.log('Upload successful:', response.data);
        setSelectedPdf(null)
        setPdfHeading('')
        onRequestClose();
      } else {
        console.log('Error in upload');
      }
    } catch (error) {
      console.error('Error uploading PDF:', error.message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Upload PDF Modal"
      className="rounded-lg border bg-gray-300 border-gray-900 shadow p-6"
      style={{
        content: {
          width: '300px',
          height: '300px',
          margin: 'auto',
          top: '50%',
          left: '50%',
          transform: 'translate(0%, 50%)',
        },
      }}
    >
      <h2 className="text-xl font-semibold mb-4 ml-16">Upload PDF</h2>
      <div>
        <label htmlFor="pdfHeading" className="text-black">
          PDF Heading:
        </label>
        <input
          type="text"
          id="pdfHeading"
          value={pdfHeading}
          onChange={handlePdfHeadingChange}
          className="w-full p-2 bg-white border border-gray-900 rounded-lg focus:outline-none focus:ring focus:border-blue-400 text-black"
        />
        {validationError && (
          <p className="text-red-500 text-sm mt-1">{validationError}</p>
        )}
      </div>
      <div className="mt-4">
        <label htmlFor="pdfFile" className="text-black">
          Select PDF:
        </label>
        <input
          type="file"
          id="pdfFile"
          accept=".pdf"
          onChange={handlePdfFileChange}
          className="w-full p-2 bg-white border border-black-900 rounded-lg focus:outline-none focus:ring focus:border-blue-400 text-black-900"
        />
         {pdfValidationError && (
          <p className="text-red-500 text-sm mt-1">{pdfValidationError}</p>
        )}
      </div>
      <button
        onClick={handleUpload}
        className="mt-4 bg-blue-700 ml-16 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:bg-blue-600"
      >
        Upload
      </button>
    </Modal>
  );
};

export default PdfUploadModal;
