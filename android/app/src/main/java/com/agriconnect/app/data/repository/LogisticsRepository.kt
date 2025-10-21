package com.agriconnect.app.data.repository

import com.agriconnect.app.data.model.LogisticsProvider
import com.agriconnect.app.data.model.Aggregator
import com.agriconnect.app.data.model.Processor
import com.agriconnect.app.supabase
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

sealed class Result<out T> {
    data class Success<out T>(val data: T) : Result<T>()
    data class Error(val exception: Exception) : Result<Nothing>()
    object Loading : Result<Nothing>()
}

class LogisticsRepository {
    fun fetchLogisticsProviders(): Flow<Result<List<LogisticsProvider>>> = flow {
        emit(Result.Loading)
        try {
            val providers = withContext(Dispatchers.IO) {
                supabase.from("logistics_providers").select().decodeList<LogisticsProvider>()
            }
            emit(Result.Success(providers))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }
    fun fetchAggregators(): Flow<Result<List<Aggregator>>> = flow {
        emit(Result.Loading)
        try {
            val aggregators = withContext(Dispatchers.IO) {
                supabase.from("aggregators").select().decodeList<Aggregator>()
            }
            emit(Result.Success(aggregators))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }
    fun fetchProcessors(): Flow<Result<List<Processor>>> = flow {
        emit(Result.Loading)
        try {
            val processors = withContext(Dispatchers.IO) {
                supabase.from("processors").select().decodeList<Processor>()
            }
            emit(Result.Success(processors))
        } catch (e: Exception) {
            emit(Result.Error(e))
        }
    }
    // Add create/update/delete methods as needed for each entity
} 