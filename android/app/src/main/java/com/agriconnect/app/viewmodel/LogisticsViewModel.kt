package com.agriconnect.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agriconnect.app.data.model.LogisticsProvider
import com.agriconnect.app.data.model.Aggregator
import com.agriconnect.app.data.model.Processor
import com.agriconnect.app.data.repository.LogisticsRepository
import com.agriconnect.app.data.repository.Result
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class LogisticsUiState(
    val providers: List<LogisticsProvider> = emptyList(),
    val aggregators: List<Aggregator> = emptyList(),
    val processors: List<Processor> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null
)

class LogisticsViewModel(
    private val repository: LogisticsRepository = LogisticsRepository()
) : ViewModel() {
    private val _uiState = MutableStateFlow(LogisticsUiState())
    val uiState: StateFlow<LogisticsUiState> = _uiState.asStateFlow()

    fun loadProviders() {
        viewModelScope.launch {
            repository.fetchLogisticsProviders().collect { result ->
                when (result) {
                    is Result.Loading -> _uiState.update { it.copy(isLoading = true, error = null) }
                    is Result.Success -> _uiState.update { it.copy(providers = result.data, isLoading = false, error = null) }
                    is Result.Error -> _uiState.update { it.copy(isLoading = false, error = result.exception.message) }
                }
            }
        }
    }
    fun loadAggregators() {
        viewModelScope.launch {
            repository.fetchAggregators().collect { result ->
                when (result) {
                    is Result.Loading -> _uiState.update { it.copy(isLoading = true, error = null) }
                    is Result.Success -> _uiState.update { it.copy(aggregators = result.data, isLoading = false, error = null) }
                    is Result.Error -> _uiState.update { it.copy(isLoading = false, error = result.exception.message) }
                }
            }
        }
    }
    fun loadProcessors() {
        viewModelScope.launch {
            repository.fetchProcessors().collect { result ->
                when (result) {
                    is Result.Loading -> _uiState.update { it.copy(isLoading = true, error = null) }
                    is Result.Success -> _uiState.update { it.copy(processors = result.data, isLoading = false, error = null) }
                    is Result.Error -> _uiState.update { it.copy(isLoading = false, error = result.exception.message) }
                }
            }
        }
    }
} 