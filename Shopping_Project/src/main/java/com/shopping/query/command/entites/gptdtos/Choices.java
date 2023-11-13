package com.shopping.query.command.entites.gptdtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Choices {
    private Message message;
    private String finish_reason;
    private int index;
}
