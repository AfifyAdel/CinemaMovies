using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace AngularToAPI.Models
{
    public class MovieLink
    {
        public long Id { get; set; }

        [Required]
        public string DownloadLink { get; set; }

        public string Quality { get; set; }

        public int Resolution { get; set; }


        [Required]
        public long MovieId { get; set; }
        [ForeignKey("MovieId")]
        public Movie Movie { get; set; }

       
    }
} 
