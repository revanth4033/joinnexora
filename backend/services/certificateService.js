const PDFDocument = require('pdfkit');
const { Certificate } = require('../models');
const fs = require('fs');
const path = require('path');

class CertificateService {
  async generateCertificate(studentName, courseName, completionDate, instructorName) {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });
    const chunks = [];

    // Register custom fonts
    doc.registerFont('Montserrat-Bold', path.join(__dirname, '../assets/fonts/Montserrat-Bold.ttf'));
    doc.registerFont('GreatVibes', path.join(__dirname, '../assets/fonts/GreatVibes-Regular.ttf'));

    doc.on('data', chunk => chunks.push(chunk));
    
    return new Promise((resolve, reject) => {
      doc.on('end', async () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });

      doc.on('error', reject);

      // === Colors and Dimensions ===
      const deepBlue = '#0a1d4e';
      const gold = '#FFD700';
      const white = '#fff';
      const accentGold = '#f7b731';
      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;

      // Background
      doc.rect(0, 0, pageWidth, pageHeight).fill(deepBlue);

      // Gold border
      doc.save()
        .lineWidth(8)
        .strokeColor(gold)
        .rect(20, 20, pageWidth - 40, pageHeight - 40)
        .stroke()
        .restore();

      // Decorative gold lines (top left and bottom right)
      doc.save();
      doc.moveTo(40, 60).lineTo(200, 60).lineTo(40, 200).closePath().fill(gold);
      doc.moveTo(pageWidth - 40, pageHeight - 60)
        .lineTo(pageWidth - 200, pageHeight - 60)
        .lineTo(pageWidth - 40, pageHeight - 200)
        .closePath().fill(gold);
      doc.restore();

      // Title
      doc.fillColor(white)
         .font('Montserrat-Bold')
         .fontSize(38)
         .text('CERTIFICATE', 0, 70, { width: pageWidth, align: 'center', characterSpacing: 2 });
      doc.fontSize(20)
         .font('Montserrat-Bold')
         .text('OF ACHIEVEMENT', 0, 110, { width: pageWidth, align: 'center', characterSpacing: 2 });

      // Subtitle
      doc.fontSize(16)
         .font('Montserrat-Bold')
         .fillColor(accentGold)
         .text('PROUDLY PRESENTED TO', 0, 160, { width: pageWidth, align: 'center', characterSpacing: 2 });

      // Student name (script font)
      doc.font('GreatVibes')
         .fontSize(54)
         .fillColor(gold)
         .text(studentName, 0, 200, { width: pageWidth, align: 'center' });

      // Course details
      doc.font('Montserrat-Bold')
         .fontSize(20)
         .fillColor(white)
         .text('for successfully completing the course', 0, 270, { width: pageWidth, align: 'center' });
      doc.font('Montserrat-Bold')
         .fontSize(28)
         .fillColor(accentGold)
         .text(courseName, 0, 310, { width: pageWidth, align: 'center' });

      // Badge/seal (move up and reduce size if needed)
      const badgePath = path.join(__dirname, '../assets/images/badge.png');
      if (fs.existsSync(badgePath)) {
        doc.image(badgePath, pageWidth / 2 - 50, 380, { width: 100, height: 100 });
      }

      // Date and Issued by (no line)
      doc.font('Montserrat-Bold').fontSize(12).fillColor(white)
        .text('Date', 120, pageHeight - 160, { width: 200, align: 'center' });
      doc.font('Montserrat-Bold').fontSize(14).fillColor(white)
        .text(completionDate, 120, pageHeight - 145, { width: 200, align: 'center' });
      doc.font('Montserrat-Bold').fontSize(12).fillColor(white)
        .text('Issued by:', pageWidth - 320, pageHeight - 160, { width: 200, align: 'center' });
      doc.font('Montserrat-Bold').fontSize(14).fillColor(accentGold)
        .text('JoinNexora', pageWidth - 320, pageHeight - 145, { width: 200, align: 'center' });
      // Certificate number (bottom center, at pageHeight - 100, guaranteed on first page)
      const certNumber = `CERT-${Date.now()}`;
      doc.font('Montserrat-Bold')
         .fontSize(10)
         .fillColor('#eee')
         .text(`Certificate ID: ${certNumber}`, 0, pageHeight - 85, { width: pageWidth, align: 'center' });

      doc.end();
    });
  }

  async uploadCertificate(pdfBuffer, fileName) {
    // Use local storage for both development and production
    const certDir = path.join(__dirname, '../certificates');
    if (!fs.existsSync(certDir)) {
      fs.mkdirSync(certDir, { recursive: true });
    }
    const filePath = path.join(certDir, fileName);
    fs.writeFileSync(filePath, pdfBuffer);
    // Return a local file path or URL
    return `/certificates/${fileName}`;
  }

  async createCertificateRecord(studentId, courseId, certificateUrl, grade = null) {
    const certificateNumber = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return await Certificate.create({
      studentId,
      courseId,
      certificateNumber,
      certificateUrl,
      grade
    });
  }
}

module.exports = new CertificateService();
