package com.example.tododash.config;

import com.example.tododash.model.Task;
import com.example.tododash.repository.TaskRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(TaskRepository taskRepository) {
        return args -> {
            // Prepopulate with example tasks
            Task task1 = new Task("Complete project documentation");
            task1.setCreatedAt(LocalDateTime.now().minusDays(3));
            task1.setCompleted(true);

            Task task2 = new Task("Review code changes");
            task2.setCreatedAt(LocalDateTime.now().minusDays(2));
            task2.setCompleted(true);

            Task task3 = new Task("Setup database migrations");
            task3.setCreatedAt(LocalDateTime.now().minusDays(1));
            task3.setCompleted(false);

            Task task4 = new Task("Deploy to staging environment");
            task4.setCreatedAt(LocalDateTime.now());
            task4.setCompleted(false);

            Task task5 = new Task("Update unit tests");
            task5.setCreatedAt(LocalDateTime.now());
            task5.setCompleted(false);

            taskRepository.save(task1);
            taskRepository.save(task2);
            taskRepository.save(task3);
            taskRepository.save(task4);
            taskRepository.save(task5);
        };
    }
}
