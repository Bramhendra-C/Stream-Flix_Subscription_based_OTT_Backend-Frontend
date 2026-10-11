package com.StreamFlixBackend.StreamFlix.service;

import com.StreamFlixBackend.StreamFlix.model.PlanType;
import com.StreamFlixBackend.StreamFlix.model.Subscription;

import java.util.List;
import java.util.Optional;

public interface SubscriptionService {

    Subscription addSubscription(Subscription subscription);

    List<Subscription> getAllSubscriptions();

    Optional<Subscription> getSubscriptionById(Long id);

    Optional<Subscription> getSubscriptionByPlan(PlanType planType);

    Subscription updateSubscription(Long id, Subscription subscription);

    void deleteSubscription(Long id);
}