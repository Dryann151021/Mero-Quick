import { AlertCircle } from 'lucide-react';
export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-card__content">
          <div className="not-found-card__header">
            <AlertCircle className="not-found-card__icon" />
            <h1 className="not-found-card__title">404 Page Not Found</h1>
          </div>

          <p className="not-found-card__text">
            Did you forget to add the page to the router?
          </p>
        </div>
      </div>
    </div>
  );
}
