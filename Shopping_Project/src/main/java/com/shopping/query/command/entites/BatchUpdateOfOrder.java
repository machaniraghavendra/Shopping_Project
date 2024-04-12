package com.shopping.query.command.entites;

import java.util.Date;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Table(name = BatchUpdateOfOrder.TABLE_NAME)
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class BatchUpdateOfOrder {

	final static String TABLE_NAME = "UPDATEORDERSBATCH";

	@PrePersist
	public void prePersist(){
		if (uuid == null){
			this.uuid= UUID.randomUUID();
		}
	}
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID uuid;
	@Column(name = "BATCH_RUN_ID")
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int BatchRunID;
	@Column(name = "TOTAL_ORDERS_UPDATED")
	private int TotalOrdersUpdated;
	@Column(name = "BATCH_NAME")
	private String batchName;
	@Column(name = "START_DATE")
	@NonNull
	private Date StartDate;
	@Column(name = "END_DATE")
	@NonNull
	private Date EndDate;
}
