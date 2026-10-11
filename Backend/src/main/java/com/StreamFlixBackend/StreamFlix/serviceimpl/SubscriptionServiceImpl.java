package com.StreamFlixBackend.StreamFlix.serviceimpl;

import com.StreamFlixBackend.StreamFlix.model.PlanType;
import com.StreamFlixBackend.StreamFlix.model.Subscription;
import com.StreamFlixBackend.StreamFlix.repository.SubscriptionRepository;
import com.StreamFlixBackend.StreamFlix.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SubscriptionServiceImpl implements SubscriptionService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Override
    public Subscription addSubscription(Subscription subscription) {
        return subscriptionRepository.save(subscription);
    }

    @Override
    public List<Subscription> getAllSubscriptions() {
        return subscriptionRepository.findAll();
    }

    @Override
    public Optional<Subscription> getSubscriptionById(Long id) {
        return subscriptionRepository.findById(id);
    }

    @Override
    public Optional<Subscription> getSubscriptionByPlan(PlanType planType) {
        return subscriptionRepository.findByPlanType(planType);
    }

    @Override
    public Subscription updateSubscription(Long id, Subscription subscription) {
        subscription.setId(id);
        return subscriptionRepository.save(subscription);
    }

    @Override
    public void deleteSubscription(Long id) {
        subscriptionRepository.deleteById(id);
    }
}