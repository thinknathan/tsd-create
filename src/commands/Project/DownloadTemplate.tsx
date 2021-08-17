import React, { useEffect } from 'react';
import { Box, Text } from 'ink';
import useFileDownload from '../../hooks/useFileDownload';
import type { WizardSteps } from '../../components/Wizard';
import Spinner from 'ink-spinner';
import Markdown from '../../components/Markdown';

type Props = WizardSteps & {
  url: string;
  onDownloaded?: (file: string) => void;
};

export default function DownloadTemplate({
  url,
  active,
  onDownloaded,
  onCompletion,
}: Props): JSX.Element {
  const download = useFileDownload(url);
  const label = 'Downloading template ';

  useEffect(() => {
    if (active) {
      if (download.complete) {
        onDownloaded?.(download.file);
        onCompletion?.(true);
      } else if (download.error) {
        onCompletion?.(false);
      }
    }
  }, [download, active]);

  if (download.isLoading) {
    return (
      <Box flexDirection="row">
        <Text>
          <Text color="cyanBright">
            <Spinner type="hamburger" />
          </Text>{' '}
          {label}
          <Text color="grey">{`${Number(download.progress / 1024).toFixed(
            2
          )} KB`}</Text>
        </Text>
      </Box>
    );
  } else if (download.error) {
    return (
      <Box flexDirection="column">
        <Text>
          <Text color="red">𐄂</Text> Template download failed!
        </Text>
        <Text color="red">
          {'  '}
          {download.error}
        </Text>
        <Markdown>{`  \`URL\`: ${url}`}</Markdown>
      </Box>
    );
  }

  return (
    <Text>
      <Text color="green">✓</Text> Downloaded template archive
    </Text>
  );
}
