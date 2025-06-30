
import jsPDF from 'jspdf';
import { CollegeMatch } from "./FormDataTypes";

export const exportToPDF = async (
  studentName: string,
  studentAggregate: number,
  filteredResults: CollegeMatch[]
) => {
  const doc = new jsPDF();
  
  // Header with logo
  try {
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.src = '/lovable-uploads/214526ee-d1c4-40fc-b3b1-0b58d7e80662.png';
    
    logoImg.onload = () => {
      doc.addImage(logoImg, 'PNG', 20, 10, 25, 12);
      
      doc.setFontSize(16);
      doc.text(`FindMyClg - DSE College Results`, 55, 18);
      
      doc.setFontSize(12);
      doc.text(`Student: ${studentName}`, 20, 35);
      doc.text(`Diploma Aggregate: ${studentAggregate}%`, 20, 45);
      doc.text(`Total Results: ${filteredResults.length}`, 20, 55);
      doc.text(`Eligible Colleges: ${filteredResults.filter(c => c.eligible).length}`, 20, 65);
      
      // Table content
      let yPosition = 80;
      doc.setFontSize(10);
      
      // Table headers
      doc.setFont(undefined, 'bold');
      doc.text('College', 20, yPosition);
      doc.text('City', 80, yPosition);
      doc.text('Branch', 110, yPosition);
      doc.text('CAP1', 150, yPosition);
      doc.text('CAP2', 170, yPosition);
      doc.text('CAP3', 190, yPosition);
      yPosition += 8;
      
      doc.setFont(undefined, 'normal');
      filteredResults.forEach((college) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        
        const status = college.eligible ? '✓' : '✗';
        doc.text(`${status} ${college.collegeName.substring(0, 25)}`, 20, yPosition);
        doc.text(college.city, 80, yPosition);
        doc.text(college.branch.substring(0, 15), 110, yPosition);
        doc.text(college.cap1Cutoff ? `${college.cap1Cutoff}%` : '-', 150, yPosition);
        doc.text(college.cap2Cutoff ? `${college.cap2Cutoff}%` : '-', 170, yPosition);
        doc.text(college.cap3Cutoff ? `${college.cap3Cutoff}%` : '-', 190, yPosition);
        yPosition += 6;
      });
      
      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text('FindMyClg - Your DSE Admission Partner', 20, 290);
        doc.text(`Page ${i} of ${pageCount}`, 180, 290);
      }
      
      doc.save(`${studentName}-college-results.pdf`);
    };
  } catch (error) {
    console.error('Error loading logo for PDF:', error);
  }
};
