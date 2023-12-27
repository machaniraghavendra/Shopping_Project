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
    public static final String STATUS_SUCCESS = "success";
    public static final String STATUS_DISPATCH = "dispatched";
    public static final String STATUS_NEARBYHUB = "near by hub";
    public static final String STATUS_CANCELLED = "cancelled";
    public static final String STATUS_DELIVERED = "delivered";
    public static final String ITEM_NOT_EXISTS = "The item %s not exists";
    public static final String ORDER = "order";
    public static final String REVIEW = "review";
}
