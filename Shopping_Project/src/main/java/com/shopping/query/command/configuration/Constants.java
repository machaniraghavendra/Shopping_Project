package com.shopping.query.command.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class Constants {

    @Value("${chat-gpt.api.url}")
    public String GPT_URL;
    @Value("${chat-gpt.api.model}")
    public String GPT_MODEL;
    @Value("${chat-gpt.api.key}")
    public String GPT_KEY;
    @Value("${batchJobTime}")
    public String BATCH_JOB_TIME;
}
