package com.mywebsite

import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.LambdaLogger
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.*

class HandlerTest {

    private val handler = Handler()

    @Test
    fun `handleRequest returns 200 for GET request`() {
        val request = APIGatewayProxyRequestEvent()
            .withHttpMethod("GET")
            .withPath("/hello")

        val response = handler.handleRequest(request, createMockContext())

        assertEquals(200, response.statusCode)
        assertTrue(response.body.contains("Hello from Kotlin Lambda!"))
    }

    @Test
    fun `handleRequest returns 200 for POST request`() {
        val request = APIGatewayProxyRequestEvent()
            .withHttpMethod("POST")
            .withPath("/hello")
            .withBody("""{"test": "data"}""")

        val response = handler.handleRequest(request, createMockContext())

        assertEquals(200, response.statusCode)
        assertTrue(response.body.contains("Received POST request"))
    }

    @Test
    fun `handleRequest returns 405 for unsupported methods`() {
        val request = APIGatewayProxyRequestEvent()
            .withHttpMethod("DELETE")
            .withPath("/hello")

        val response = handler.handleRequest(request, createMockContext())

        assertEquals(405, response.statusCode)
    }

    private fun createMockContext(): Context {
        return object : Context {
            override fun getAwsRequestId() = "test-request-id"
            override fun getLogGroupName() = "test-log-group"
            override fun getLogStreamName() = "test-log-stream"
            override fun getFunctionName() = "test-function"
            override fun getFunctionVersion() = "1"
            override fun getInvokedFunctionArn() = "arn:aws:lambda:us-east-1:123456789:function:test"
            override fun getIdentity() = null
            override fun getClientContext() = null
            override fun getRemainingTimeInMillis() = 30000
            override fun getMemoryLimitInMB() = 512
            override fun getLogger() = LambdaLogger { message -> println(message) }
        }
    }
}
