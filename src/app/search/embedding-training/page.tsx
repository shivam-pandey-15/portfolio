export default function Page() { 
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">7. Training Embedding Models</h1>
      <p className="text-xl text-muted-foreground">
        How to train domain-specific embeddings for search relevance.
      </p>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h2>Why Train Your Own?</h2>
        <p>
          Generic embeddings (OpenAI, Sentence Transformers) work well for general text. 
          But domain-specific search requires understanding your vocabulary, user intent, and click patterns.
        </p>
        <h3>What You'll Learn</h3>
        <ul>
          <li>Contrastive learning: triplet loss, InfoNCE</li>
          <li>Training data: mining hard negatives from click logs</li>
          <li>Fine-tuning pre-trained models (BERT, E5, GTE)</li>
          <li>Evaluation: Recall@K, MRR, embedding visualization</li>
          <li>Production: quantization, distillation, ONNX export</li>
        </ul>
      </div>
    </div>
  );
}
