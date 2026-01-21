package com.mywebsite

import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.RequestHandler
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent
import com.google.gson.Gson

class Handler : RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    private val gson = Gson()

    override fun handleRequest(
        input: APIGatewayProxyRequestEvent,
        context: Context
    ): APIGatewayProxyResponseEvent {
        val logger = context.logger
        logger.log("Received request: ${input.httpMethod} ${input.path}")

        return when (input.httpMethod) {
            "GET" -> handleGet(input)
            "POST" -> handlePost(input)
            else -> createResponse(405, mapOf("error" to "Method not allowed"))
        }
    }

    private fun handleGet(input: APIGatewayProxyRequestEvent): APIGatewayProxyResponseEvent {
        val response = mapOf(
            "message" to "Hello from Kotlin Lambda!",
            "path" to input.path,
            "timestamp" to System.currentTimeMillis()
        )
        return createResponse(200, response)
    }

    private fun handlePost(input: APIGatewayProxyRequestEvent): APIGatewayProxyResponseEvent {
        val body = input.body ?: "{}"
        val response = mapOf(
            "message" to "Received POST request",
            "receivedBody" to body,
            "timestamp" to System.currentTimeMillis()
        )
        return createResponse(200, response)
    }

    private fun createResponse(statusCode: Int, body: Map<String, Any?>): APIGatewayProxyResponseEvent {
        return APIGatewayProxyResponseEvent()
            .withStatusCode(statusCode)
            .withHeaders(
                mapOf(
                    "Content-Type" to "application/json",
                    "Access-Control-Allow-Origin" to "*",
                    "Access-Control-Allow-Methods" to "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers" to "Content-Type, Authorization"
                )
            )
            .withBody(gson.toJson(body))
    }
}
