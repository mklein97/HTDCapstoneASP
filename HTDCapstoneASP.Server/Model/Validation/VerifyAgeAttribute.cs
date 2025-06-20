using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations;

namespace HTDCapstoneASP.Server.Model.Validation
{
    public class VerifyAgeAttribute : ValidationAttribute
    {
        public VerifyAgeAttribute(int age)
        {
            Age = age;
        }
        public int Age { get; private set; }
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if ((DateOnly?)value <= DateOnly.FromDateTime(DateTime.Now).AddYears(-Age))
            {
                return ValidationResult.Success;
            }
            return new ValidationResult(FormatErrorMessage(validationContext.DisplayName));
        }
        
        public override string FormatErrorMessage(string name)
        {
            return string.Format(ErrorMessageString, name, Age);
        }
    }
}

