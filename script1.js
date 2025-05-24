const sentimentWords = {
    positive: ['love', 'like', 'great', 'awesome', 'happy', 'good', 'wonderful', 'excellent'],
    negative: ['hate', 'dislike', 'bad', 'terrible', 'awful', 'sad', 'angry', 'horrible']
};

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize buttons
    document.getElementById('analyzeButton').addEventListener('click', analyzeSentiment);

    // Run object detection on image load
    document.getElementById('upload').addEventListener('change', event => {
        const file = event.target.files[0];
        const img = document.getElementById('detectionImage');
        if (file) {
            img.src = URL.createObjectURL(file);
            img.onload = () => runDetection(img);
        }
    });
});

// Object Detection
async function runDetection(img) {
    try {
        const model = await cocoSsd.load();
        console.log('COCO-SSD model loaded successfully');

        const resultsDiv = document.getElementById('detectionResults');

        if (!img) {
            console.error('Image element not found');
            resultsDiv.textContent = 'Error: Detection image not found';
            return;
        }

        const predictions = await model.detect(img);

        if (predictions.length === 0) {
            resultsDiv.innerHTML = '<p>No objects detected.</p>';
            return;
        }

        let html = '<ul>';
        predictions.forEach(prediction => {
            const scorePercent = (prediction.score * 100).toFixed(2);
            html += `<li>${prediction.class} (${scorePercent}%)</li>`;
        });
        html += '</ul>';

        resultsDiv.innerHTML = html;
    } catch (error) {
        console.error('Error loading COCO-SSD model:', error);
        document.getElementById('detectionResults').textContent = 'Error loading object detection model';
    }
}

// Sentiment Analysis
function analyzeSentiment() {
    const text = document.getElementById('sentimentText').value.trim();
    const resultDiv = document.getElementById('sentimentResult');

    if (!text) {
        alert('Please enter some text to analyze');
        return;
    }

    let positiveCount = 0;
    let negativeCount = 0;
    const words = text.toLowerCase().split(/\s+/);

    words.forEach(word => {
        if (sentimentWords.positive.includes(word)) positiveCount++;
        if (sentimentWords.negative.includes(word)) negativeCount++;
    });

    let sentiment, sentimentClass;
    if (positiveCount > negativeCount) {
        sentiment = 'Positive';
        sentimentClass = 'positive';
    } else if (negativeCount > positiveCount) {
        sentiment = 'Negative';
        sentimentClass = 'negative';
    } else {
        sentiment = 'Neutral';
        sentimentClass = 'neutral';
    }

    resultDiv.innerHTML = `<p class="${sentimentClass}">Sentiment: ${sentiment}</p>`;
    console.log(`Sentiment Analysis: ${sentiment}`);
}
