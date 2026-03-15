package com.researchgenie.ai.controller;

import com.researchgenie.ai.dto.ResearchRequest;
import com.researchgenie.ai.service.ResearchService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/research")
public class ResearchController {

    private final ResearchService researchService;

    public ResearchController(ResearchService researchService) {
        this.researchService = researchService;
    }

    @PostMapping("/process")
    public String processContent(@RequestBody ResearchRequest request) {
        return researchService.processContent(request);
    }
}