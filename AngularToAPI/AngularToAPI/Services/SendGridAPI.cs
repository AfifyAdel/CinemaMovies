using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AngularToAPI.Services
{
    public  static class SendGridAPI
    {
        public static async Task<bool> Execute(string userEmail, string userName, string subject, string plainTextContent,string htmlContent)
        {
            var apiKey = "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";
            var client = new SendGridClient(apiKey);
            var to = new EmailAddress(userEmail, userName);
            var from = new EmailAddress("afifyadel25@gmail.com", "AfifyCompany");
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);
            return await Task.FromResult(true);
        }
    }
}
