using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace ShmayaService.Entities
{
	[DataContract]
	public class KeyValue<Id, Name>
	{
			[DataMember]
			public Id iId { get; set; }
			[DataMember]
			public Name nvName { get; set; }

		public KeyValue(Id id, Name name)
		{
			this.iId = id;
			this.nvName = name;
		}

		public KeyValue()
		{

		}

	}
}