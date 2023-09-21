package com.shopping.query.command.entites;

import java.util.Date;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = BatchUpdateOfOrder.TABLE_NAME)
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class BatchUpdateOfOrder {

	final static String TABLE_NAME = "UPDATEORDERSBATCH";

	@Id
	@Column(name = "BatchRunID")
	private int BatchRunID;
	@Column(name = "TOTALORDERSUPDATED")
	private int TotalOrdersUpdated;
	@Column(name = "BATCHNAME")
	private String batchName;
	@Column(name = "STARTDATE")
	@NonNull
	private Date StartDate;
	@Column(name = "ENDDATE")
	@NonNull
	private Date EndDate;
}
