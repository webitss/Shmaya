using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Web;
using NReco.PdfGenerator;
using ShmayaService.Utilities;

namespace ShmayaService.Entities
{
    public class FileManageCtrl
    {
		public static void DeleteAllFile(string sURL/*, string sShortFileName*/)
		{
			try
			{
				string[] filePaths = Directory.GetFiles(sURL);
				foreach (string filePath in filePaths)
					File.Delete(filePath);

			}
			catch (Exception e)
			{
				Log.ExceptionLog(e.Message, "DeleteFile: sPath-" + sURL + ", sShortFileName-" );
			}
		}

		public void DeleteFile(string sPath, string subFile)
        {
            try
            {
                File.Delete(AppDomain.CurrentDomain.BaseDirectory + "Files\\" + subFile+"\\"+ sPath);
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

        public string SaveFile(string sFile, string subFile, string sFileType, int iUserManagerId)
        {
            try
            {

                byte[] array = Convert.FromBase64String(sFile);
                string FileName = DateTime.Now.ToFileTime().ToString() + iUserManagerId + "." + sFileType;
                File.WriteAllBytes(AppDomain.CurrentDomain.BaseDirectory + "Files\\" + subFile +"\\"+ FileName, array);
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

                string filePath = System.Configuration.ConfigurationManager.AppSettings["BaseUrlForPDF"] + url;
                //string filePath = url;
                var pdfBytes = pdf.GeneratePdfFromFile(filePath, null);
                sFileName = "דוח שעות" + sFileName;
                File.WriteAllBytes(System.Configuration.ConfigurationManager.AppSettings["ReportFiles"] + folderName + sFileName + ".pdf", pdfBytes);
				//File.WriteAllBytes( folderName + sFileName + ".pdf", pdfBytes);

                return filePath;
            }
            catch (Exception ex)
            {
                Log.ExceptionLog(ex.Message, "GenerateAttendanceReport");
                return null;
            }
        }

		public static string GeneratePdfFromHtml(string title, string html, string css, string sFileName, string identityTranslator)
		{
			try
			{

				NReco.PdfGenerator.HtmlToPdfConverter pdf = new NReco.PdfGenerator.HtmlToPdfConverter();
				pdf.Margins = new NReco.PdfGenerator.PageMargins();
				pdf.Margins.Top = 10;
				pdf.Margins.Bottom = 10;
				pdf.Margins.Right = 10;
				pdf.Margins.Left = 10;
				pdf.Size = PageSize.A4;
				pdf.Orientation = PageOrientation.Landscape;

				//pdf.CustomWkHtmlTocArgs = "--toc-disable-back-links";
				//pdf.CustomWkHtmlPageArgs = "--header-html";
				//pdf.Size = PageSize.A4;

				//string hostName = System.ServiceModel.Web.WebOperationContext.Current.IncomingRequest.UriTemplateMatch.RequestUri.Host + System.Web.Hosting.HostingEnvironment.ApplicationHost.GetVirtualPath();
				//css = css.Replace("../", hostName + "/");
				//pdf.PageFooterHtml = "<div style='text-align:center;'><span class='page' style='border-left:1px solid #ddbfd3 ;padding-left:10px'></span> / <span style='border-right:1px solid #ddbfd3 ;padding-right:10px' class='topage'></span></div>";
				//pdf.PageHeaderHtml = "<div><div style='text-align:center; font-size:20px; color: #06416D ; font-family: Arial'>" + title + "</div></div>";
				html = "<html><head><meta charset='utf-8' /><style type='text/css'>" + css + "</style></head>" +
					"<body><div style='text-align:right;' dir='rtl'>" + html + "</div></body></html>";
				string fileName = sFileName.Replace("\\", "").Replace("/", "").Replace(":", "").Replace("*", "").Replace("?", "").Replace("\"", "").Replace("<", "").Replace(">", "").Replace("|", "") + "_" + DateTime.Now.ToFileTime();
				sFileName += "_" + DateTime.Now.ToFileTime().ToString() + ".pdf";
				byte[] Bytes = Encoding.UTF8.GetBytes(html);

				File.WriteAllBytes(AppDomain.CurrentDomain.BaseDirectory + "\\Files\\pdfReports\\pdfGenerator" + fileName+".html", Bytes);
				Log.ExceptionLog("file path: ", AppDomain.CurrentDomain.BaseDirectory + "Files\\pdfReports\\pdfGenerator" + fileName + ".html");
				var pdfBytes = pdf.GeneratePdfFromFile(AppDomain.CurrentDomain.BaseDirectory + "\\Files\\pdfReports\\pdfGenerator" + fileName+".html", null);

				File.WriteAllBytes(AppDomain.CurrentDomain.BaseDirectory + "\\Files\\pdfReports\\pdfGenerator" + fileName+".pdf", pdfBytes);

				//File.WriteAllBytes(dir + fileName + ".pdf", pdfBytes);
				List<UserBasic> lusers = new List<UserBasic>();
				UserBasic provider = new UserBasic();
				UserBasic shmaya = new UserBasic();
				shmaya.nvEmail = "simanim1@gmail.com";
				lusers = UserBasic.GetUsersBasic(3);
				foreach (UserBasic user in lusers)
				{
					if (user.nvID == identityTranslator)
					{
						provider = user;
						break;
					}
				}
				lusers = new List<UserBasic>();
				lusers.Add(provider);
				lusers.Add(shmaya);
				Messages message = new Messages();
				message.nvFrom = "shmaya@gmail.com";
				message.nvSubject = "מצ\"ב דו\"ח ביצוע הזמנה";
				List<Attachment> lAttach = new List<Attachment>();
				lAttach.Add(new Attachment(AppDomain.CurrentDomain.BaseDirectory + "\\Files\\pdfReports\\pdfGenerator" + fileName + ".pdf"));
				Messages.SendEmailToGroup(lusers, message, 1, lAttach);

				return fileName + ".pdf";
			}
			catch (Exception ex)
			{
				Log.ExceptionLog(ex.Message, "GeneratePdfFromHtml");
				return null;
			}
		}
	}
}