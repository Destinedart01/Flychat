import { getPlatform } from '@/lib/platforms';
import { PLATFORM_ICONS } from '@/components/PlatformIcons';

export default function FlyerPreviewCard({ imageSrc, businessName, platform = 'whatsapp' }) {
  const config = getPlatform(platform);
  const Icon = PLATFORM_ICONS[config.key];

  return (
    <div className="preview-card">
      <div className="preview-card-label">Preview — this is what visitors will see</div>
      <div className="preview-card-frame">
        {imageSrc ? (
          <img src={imageSrc} alt="Flyer preview" />
        ) : (
          <div className="preview-card-placeholder" />
        )}
        <div className="preview-card-body">
          {businessName && <div className="preview-card-name">{businessName}</div>}
          <div className={`preview-card-cta preview-card-${config.key}`}>
            <Icon size={14} />
            {config.buttonText}
          </div>
        </div>
      </div>
    </div>
  );
}
