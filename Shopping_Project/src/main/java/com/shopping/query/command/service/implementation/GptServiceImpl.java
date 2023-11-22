package com.shopping.query.command.service.implementation;

import com.shopping.query.command.configuration.Constants;
import com.shopping.query.command.entites.gptdtos.Message;
import com.shopping.query.command.entites.gptdtos.RequestBody;
import com.shopping.query.command.entites.gptdtos.ResponseBody;
import com.shopping.query.command.service.GptService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Objects;


@Service
@Slf4j
public class GptServiceImpl extends SecurityServiceImpl implements GptService {

    @Autowired
    private Constants constants;

    @Override
    public String getResponse(String query) {
        try {
            Message message = Message.builder().role("user").content(query).build();
            RequestBody requestBody = RequestBody.builder().model(decrypt(constants.GPT_MODEL))
                    .messages(List.of(message)).build();
            HttpHeaders headers = new HttpHeaders();
            headers.add("Authorization", "Bearer " + decrypt(constants.GPT_KEY));
            headers.add("Content-Type", "application/json");
            RestTemplate restTemplate = new RestTemplate();
            log.info("Calling to Chat gpt");
            var response = restTemplate.postForEntity(decrypt(constants.GPT_URL), new HttpEntity<>(requestBody, headers), ResponseBody.class);
            log.info("Got response ");
            if (response.hasBody()) {
                return Objects.requireNonNull(response.getBody()).getChoices().get(0).getMessage().getContent();
            }
        }catch (Exception e ) {
            log.error(e.getMessage());
            return "Something went wrong";
        }
        return "Something went wrong";
    }
}
