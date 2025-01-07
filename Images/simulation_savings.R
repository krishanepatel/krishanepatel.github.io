###############################################################################################################################
################################                      Simulated savings study                  ################################
###############################################################################################################################

#clear env
rm(list=ls())

#load packages
library(dplyr)
library(ggplot2)
library(VGAM)
library(tidyr)
library(sandwich)
library(data.table)
library(lmtest)

###############################################################################################################################
## Purpose: This code is designed to simulate the impact in psychology of design for savings products, specificially opening multiple tiered instant access savings


#I'm using a simple matching heuristic which is that I have X goals (2 or 3) 
# Each has different weights of importance and allocate funds based on these weights


# Function to generate three numbers that sum to one
generate_sum_to_one_three <- function() {
  # Generate three random numbers
  numbers <- runif(3)
  # Normalize the numbers so that they sum to one
  normalized_numbers <- numbers / sum(numbers)
  # Round the numbers to two decimal places
  rounded_numbers <-  normalized_numbers
  # Adjust the last number to ensure the sum is exactly one
  rounded_numbers[3] <- 1 - sum(rounded_numbers[1:2])
  return(rounded_numbers)
}

# Function to generate three numbers that sum to one
generate_sum_to_one_two <- function() {
  # Generate three random numbers
  numbers <- runif(2)
  # Normalize the numbers so that they sum to one
  normalized_numbers <- numbers / sum(numbers)
  # Round the numbers to two decimal places
  rounded_numbers <-  normalized_numbers
  # Adjust the last number to ensure the sum is exactly one
  rounded_numbers[2] <- 1 - sum(rounded_numbers[1])
  rounded_numbers[3] <- 0
  return(rounded_numbers)
}

#I wrote a function here to generate a distribution based on recent data
# Function to generate a log-normal distribution based on given summary statistics
generate_savings_sample <- function(n, mean_log, sd_log, min_savings, max_savings) {
  savings_sample <- rlnorm(n, meanlog = mean_log, sdlog = sd_log)
  savings_sample <- savings_sample[savings_sample <= max_savings & savings_sample >= min_savings]
  
  while (length(savings_sample) < n) {
    additional_values <- rlnorm(n, meanlog = mean_log, sdlog = sd_log)
    additional_values <- additional_values[additional_values <= max_savings & additional_values >= min_savings]
    savings_sample <- c(savings_sample, additional_values)
  }
  
  return(savings_sample[1:n])
}

# Set seed for reproducibility
set.seed(123)

# Parameters for the log-normal distribution based on the given summary statistics
# Given percentiles
p25 <- 1000
p50 <- 5500

# Estimate parameters for the log-normal distribution
# Using quantile matching for log-normal distribution
log_p25 <- log(p25)
log_p50 <- log(p50)
#log_p75 <- log(p75)



interest_breaks = c(-Inf, 9999, 24999, 39999, 54999, Inf)
interest_labels = c(0.018, 0.023, 0.029, 0.034, 0.038)


# Calculate mu and sigma
mu <- log_p50
#sigma <- (log_p75 - log_p25) / (2 * qnorm(0.75))
sigma <- (log_p50 - log_p25) / qnorm(0.75)  # Based on the relationship between p25 and p50


n = 10^6

# Generate 1000 sets of three numbers that sum to one 
goals_weight <- rbind(
  t(replicate(n, generate_sum_to_one_two())), # matching heuristic for 2 goals
  t(replicate(n, generate_sum_to_one_three())), # matching heuristic for 3 goals
  t(rbind(rep(1/2,n),rep(1/2,n),rep(0,n))), # diversification heuristic for 2 goals
  t(rbind(rep(1/3,n),rep(1/3,n),rep(1/3,n))),
  t(rbind(rep(0,n),rep(0,n),rep(1,n)))
  ) #diversification heuristic for 3 goals
savings <- rlnorm(nrow(goals_weight), meanlog = mu, sdlog = sigma)
group <- t(cbind(
  t(rep("matching_2",n)),
  t(rep("matching_3",n)),
  t(rep("divers_2",n)),
  t(rep("divers_3",n)),
  t(rep("optimal",n))))
data <- data.table(data.frame(goals_weight,savings,group))
colnames(data) <- c(paste0(rep("weight_",3), seq(1,3)),"savings","group")


for(i in 1:3){
  # Dynamically create the allocation column based on the weight column
  data[[paste0("allocation_", i)]] <- data[[paste0("weight_", i)]] * data$savings
}


# Loop through allocation columns and calculate corresponding interest rates
for(i in 1:3){
  # Use cut() to assign interest rates based on allocation values and predefined breakpoints
  data[[paste0("interestRate_", i)]] <- cut(data[[paste0("allocation_", i)]], 
                                        breaks = interest_breaks, 
                                        labels = interest_labels, 
                                        right = FALSE)
  
  # Convert the factor returned by cut() into numeric values
  data[[paste0("interestRate_", i)]] <- as.numeric(as.character(data[[paste0("interestRate_", i)]]))
  
}

for(i in 1:3){
data[[paste0("interest_", i)]] <- data[[paste0("allocation_", i)]] * (1 + data[[paste0("interestRate_", i)]])
}

data$interest_sum <- (data$interest_1 + data$interest_2 + data$interest_3)
data$interest_log <- (data$interest_1 + data$interest_2 + data$interest_3 - data$savings)
data$group <- relevel(factor(data$group), ref = "optimal")
data$div <- ifelse(data$group=="divers_2",1,ifelse(data$group=="divers_3",1,0))
data$mat <- ifelse(data$group=="matching_2",1,ifelse(data$group=="matching_3",1,0))
data$opt <- as.numeric(data$group=="optimal")
data$n_acc2 <- ifelse(data$group=="matching_2",1,ifelse(data$group=="divers_2",1,0))
data$n_acc3 <- ifelse(data$group=="matching_3",1,ifelse(data$group=="divers_3",1,0))


# Run OLS with the log-transformed monetary variable
model1 <- lm(log(interest_log) ~div+mat, data = data)
model2 <- lm(log(interest_log) ~ group, data = data)
car::linearHypothesis(model1, c('div = mat'))

# Apply heteroskedasticity-consistent standard errors
coeftest_output <- coeftest(model2, vcov = vcovHC(model2, type = "HC1"))
# Get confidence intervals for the coefficients
conf_intervals <- confint(model2)

# Extract the intercept (optimal strategy) and exponentiate it to get the baseline interest
baseline_interest <- exp(coeftest_output[1, 1])  # This gives the optimal group's estimated interest (~£320)

# Create a data frame to store the results for plotting
results <- data.frame(
  group = rownames(coeftest_output),       # Groups (including intercept for "optimal")
  estimate = coeftest_output[, 1],         # Coefficients (log-transformed)
  std_error = coeftest_output[, 2],        # Standard Errors
  lower_ci = conf_intervals[, 1],          # Lower bound of CI
  upper_ci = conf_intervals[, 2]           # Upper bound of CI
)



# Now calculate the estimated mean interest for each group
# For the intercept (optimal), the interest is just the baseline
baseline <- exp(results$estimate[1])
lb <- exp(results$lower_ci[1])
ub <- exp(results$upper_ci[1])

# Now calculate the estimated mean interest for each group
# For the intercept (optimal), the interest is just the baseline
results$interest_earned <- ifelse(results$group == "(Intercept)", baseline_interest, baseline_interest * exp(results$estimate))

# Calculate confidence intervals for each group's interest earned (relative to baseline)
results$lower_bound <- ifelse(results$group == "(Intercept)", baseline_interest, baseline_interest * exp(results$lower_ci))
results$upper_bound <- ifelse(results$group == "(Intercept)", baseline_interest, baseline_interest * exp(results$upper_ci))
results$interest_earned[1] <- baseline
results$lower_bound[1] <- lb
results$upper_bound[1] <- ub

ggplot(results, aes(x = group, y = interest_earned)) +
  geom_bar(stat = "identity", fill = "skyblue") +
  geom_errorbar(aes(ymin = lower_bound, ymax = upper_bound), width = 0.2) +
  labs(title = "Estimated Mean Interest Earned by Group with 95% CIs",
       x = "Group",
       y = "Interest Earned (£)") +
  theme_minimal()

# Create custom contrasts to compare individual Divers_2 vs. Divers_3 and Matching_2 vs. Matching_3
contrasts(data$group) <- cbind(
  divers_vs_optimal = c(2, 1, 1, -1, -1),  # Divers_2 and Divers_3 vs Optimal
  # matching_vs_optimal = c(-4, 0, 0, 1, 1), # Matching_2 and Matching_3 vs Optimal
  # divers2_vs_divers3 = c(0, 1, -1, 0, 0),  # Divers_2 vs Divers_3
  # matching2_vs_matching3 = c(0, 0, 0, 1, -1) # Matching_2 vs Matching_3
)

# Fit the model with custom contrasts
model_custom <- lm(log(interest_log) ~ group, data = data)

# Summary of the model
summary(model_custom)

# Apply heteroskedasticity-consistent standard errors
coeftest_custom <- coeftest(model_custom, vcov = vcovHC(model_custom, type = "HC1"))



