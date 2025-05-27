const SummarySection = ({ summary }) => (
  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r">
    <h3 className="text-lg font-medium text-blue-800 mb-2">Summary</h3>
    <div className="text-blue-700 space-y-2">
      {summary?.summary.split("\n").map((line, index) => (
        <p key={index} className="whitespace-pre-wrap">
          {line.replace(/\*\*(.*?)\*\*/g, `$1`)}
        </p>
      ))}
    </div>
  </div>
);

export default SummarySection;
