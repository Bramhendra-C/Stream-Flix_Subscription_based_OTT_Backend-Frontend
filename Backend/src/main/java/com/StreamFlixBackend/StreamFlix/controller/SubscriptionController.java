package com.StreamFlixBackend.StreamFlix.controller;

import com.StreamFlixBackend.StreamFlix.model.PlanType;
import com.StreamFlixBackend.StreamFlix.model.Subscription;
import com.StreamFlixBackend.StreamFlix.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/subscriptions")
@CrossOrigin("*")
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    @PostMapping
    public Subscription addSubscription(@RequestBody Subscription subscription){
        return subscriptionService.addSubscription(subscription);
    }

    @GetMapping
    public List<Subscription> getAllSubscriptions(){
        return subscriptionService.getAllSubscriptions();
    }

    @GetMapping("/{id}")
    public Optional<Subscription> getSubscriptionById(@PathVariable Long id){
        return subscriptionService.getSubscriptionById(id);
    }

    @GetMapping("/plan/{plan}")
    public Optional<Subscription> getSubscriptionByPlan(@PathVariable PlanType plan){
        return subscriptionService.getSubscriptionByPlan(plan);
    }

    @PutMapping("/{id}")
    public Subscription updateSubscription(@PathVariable Long id,
                                           @RequestBody Subscription subscription){
        return subscriptionService.updateSubscription(id, subscription);
    }

    @DeleteMapping("/{id}")
    public String deleteSubscription(@PathVariable Long id){
        subscriptionService.deleteSubscription(id);
        return "Subscription Deleted Successfully";
    }
}