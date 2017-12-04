using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace Service.Entities
{
	[DataContract]
	public class Orders
	{
		[DataMember]
		public int iOrderId { get; set; }
		[DataMember]
		public int iUserId { get; set; }
		[DataMember]
		public int iTypeOrder { get; set; }
		[DataMember]
		public int iTypeTranslation { get; set; }
		[DataMember]
		public int iGenderTraslator { get; set; }
		[DataMember]
		public int iArea { get; set; }
		[DataMember]
		public int iCityId { get; set; }
		[DataMember]
		public string nvStreet { get; set; }
		[DataMember]
		public string nvNumberHouse { get; set; }
		[DataMember]
		public DateTime? dtDateTraslation { get; set; }
		[DataMember]
		public DateTime? dtTimeBegin { get; set; }
		[DataMember]
		public DateTime? dtTimeEnd { get; set; }
		[DataMember]
		public int iFavoriteTranslator { get; set; }
		[DataMember]
		public int iSelectedTranslator { get; set; }
		[DataMember]
		public int iStatusId { get; set; }
		[DataMember]
		public string nvTypeTranslation { get; set; }
		[DataMember]
		public int iStatusByDeaf { get; set; }
		[DataMember]
		public int iStatusByTranslator { get; set; }
		[DataMember]
		public string nvReason { get; set; }
		[DataMember]
		public int iLanguageId { get; set; }
		[DataMember]
		public bool isQwickOrder { get; set; }



		

	}
}