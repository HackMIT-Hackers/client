import { useState } from 'react';
import { Navbar, Center, Tooltip, Group, Button, TextInput, createStyles, Footer } from '@mantine/core';
import {
  TablerIcon,
  IconBrush,
  IconZoomIn,
  IconWand,
  IconRectangle,
  IconLasso,
  IconColorPicker,
  IconBucket,
  IconHandStop,
} from '@tabler/icons';
import {ReactComponent as Logo} from '../assets/logo.svg';

const useStyles = createStyles((theme) => ({
    footer: {
        padding: "10px !important"
    }
  }),
);


export function FooterBar() {
  const [promptActive, setPromptActive] = useState(true);
  const { classes, cx } = useStyles();

  return (
    <Footer height={60} className={classes.footer} p="md" >
        <Group position="right">
            <TextInput
                placeholder="Your prompt"
                radius="md"
                size="sm"
                withAsterisk
            />
            <Button>Generate</Button>
        </Group>
    </Footer>
  );
}