using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.IO;
using System.Linq;
using System.Web;
using NReco.PdfGenerator;
using ShmayaService.Utilities;

namespace ShmayaService.Entities
{
    public class FileManageCtrl
    {
        public void DeleteFile(string sPath)
        {
            try
            {
                File.Delete(AppDomain.CurrentDomain.BaseDirectory + "Files\\" + sPath);
            }
            catch (Exception ex)
            {
                Log.ExceptionLog("DeleteFile", "Exception: " + ex.Message);

            }
        }

        public string SaveFileClient(string sFolder, string sFile, string sFileType, int size, int index)
        {
            try
            {
                sFile = sFile.Substring(sFile.LastIndexOf(",") + 1);
                byte[] array = Convert.FromBase64String(sFile);
                string FileName = DateTime.Now.ToFileTime().ToString() + index.ToString() + "." + sFileType;

                File.WriteAllBytes(AppDomain.CurrentDomain.BaseDirectory + "Files\\" + sFolder + "\\" + FileName, array);




                return FileName;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog("SaveFile", "Exception: " + ex.Message);
                throw ex;
            }
        }

        public string SaveFile(string sFile, string sFileType, int iUserManagerId)
        {
            try
            {

                byte[] array = Convert.FromBase64String(sFile);
                string FileName = DateTime.Now.ToFileTime().ToString() + iUserManagerId + "." + sFileType;

                File.WriteAllBytes(AppDomain.CurrentDomain.BaseDirectory + "Files\\" + FileName, array);




                return FileName;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog("SaveFile", "Exception: " + ex.Message);
                throw ex;
            }
        }

        public System.Drawing.Size GetSizeProduct(int height, int width, int imgWidth, int imgHeight)
        {
            if (height != null || width != null)
            {
                if (height != null && height != 0)
                {
                    height = Convert.ToInt32(height);
                    double dblWidth = ((double)height / (double)imgHeight) * imgWidth;
                    width = Convert.ToInt32(dblWidth);
                }
                else if (width != null && width != 0)
                {
                    width = Convert.ToInt32(width);
                    double dblHeight = ((double)width / (double)imgWidth) * imgHeight;
                    height = Convert.ToInt32(dblHeight);
                }
            }
            System.Drawing.Size Size = new System.Drawing.Size(width, height);
            return Size;
        }

        public System.Drawing.Image resizeImage(System.Drawing.Image imgToResize, Size size)
        {
            int sourceWidth = imgToResize.Width;
            int sourceHeight = imgToResize.Height;

            float nPercent = 0;
            float nPercentW = 0;
            float nPercentH = 0;

            nPercentW = ((float)size.Width / (float)sourceWidth);
            nPercentH = ((float)size.Height / (float)sourceHeight);

            if (nPercentH < nPercentW)
                nPercent = nPercentH;
            else
                nPercent = nPercentW;

            int destWidth = (int)(sourceWidth * nPercent);
            int destHeight = (int)(sourceHeight * nPercent);

            Bitmap b = new Bitmap(destWidth, destHeight);
            Graphics g = Graphics.FromImage((System.Drawing.Image)b);
            g.SmoothingMode = SmoothingMode.AntiAlias;
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;

            g.DrawImage(imgToResize, 0, 0, destWidth, destHeight);
            g.Dispose();

            return (System.Drawing.Image)b;
        }

        public byte[] ImageByteGet(string sImage, int size)
        {
            byte[] bytes = Convert.FromBase64String(sImage);
            Image image;
            using (MemoryStream ms = new MemoryStream(bytes))
            {
                image = Image.FromStream(ms);
            }
            //מאפייני התמונה 
            int Height = image.Height;
            int width = image.Width;
            int weight = (int)bytes.Length;
            //קביעת גודל פרופורינלי לתמונה
            System.Drawing.Size Size = new System.Drawing.Size();
            if (Height > width)
                Size = GetSizeProduct(size, 0, width, Height);
            else
                Size = GetSizeProduct(0, size, width, Height);
            //שמירת התמונה בגודל החדש
            System.Drawing.Image smallImage = resizeImage(image, Size);
            MemoryStream mSmallImage = new MemoryStream();
            smallImage.Save(mSmallImage, System.Drawing.Imaging.ImageFormat.Png);
            mSmallImage.Dispose();
            return mSmallImage.ToArray();
        }

        public static string GenerateAttendanceReport(string folderName, string url)
        {
            try
            {
                NReco.PdfGenerator.HtmlToPdfConverter pdf = new NReco.PdfGenerator.HtmlToPdfConverter();
                pdf.Margins = new NReco.PdfGenerator.PageMargins();
                pdf.Margins.Top = 1;
                pdf.Margins.Bottom = 5;
                pdf.Margins.Right = 1;
                pdf.Margins.Left = 1;
                pdf.Size = PageSize.A4;
                pdf.Orientation = PageOrientation.Landscape;

                string sFileName = DateTime.Now.ToFileTime().ToString();

                string filePath = System.Configuration.ConfigurationManager.AppSettings["BaseUrl"] + url;

                var pdfBytes = pdf.GeneratePdfFromFile(filePath, null);
                sFileName = "דוח שעות" + sFileName;
                File.WriteAllBytes(System.Configuration.ConfigurationManager.AppSettings["ReportFiles"] + folderName + sFileName + ".pdf", pdfBytes);
                return filePath;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "GenerateAttendanceReport");
                return null;
            }
        }
    }
}