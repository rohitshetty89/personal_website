plugins {
    kotlin("jvm") version "1.9.22"
    id("com.github.johnrengelman.shadow") version "8.1.1"
}

group = "com.mywebsite"
version = "1.0.0"

repositories {
    mavenCentral()
}

dependencies {
    // AWS Lambda
    implementation("com.amazonaws:aws-lambda-java-core:1.2.3")
    implementation("com.amazonaws:aws-lambda-java-events:3.11.4")

    // JSON serialization
    implementation("com.google.code.gson:gson:2.10.1")

    // Kotlin
    implementation(kotlin("stdlib"))

    // Testing
    testImplementation(kotlin("test"))
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.1")
}

tasks.test {
    useJUnitPlatform()
}

kotlin {
    jvmToolchain(21)
}

// Build a fat JAR for Lambda deployment
tasks.shadowJar {
    archiveBaseName.set("backend")
    archiveClassifier.set("")
    archiveVersion.set("")
}

// Make build depend on shadowJar
tasks.build {
    dependsOn(tasks.shadowJar)
}
