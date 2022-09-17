import { useState } from 'react';
import { Navbar, Center, Tooltip, Group, MediaQuery, Button, TextInput, createStyles, Footer, Slider, UnstyledButton, Collapse } from '@mantine/core';
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
  IconChevronLeft,
  IconChevronRight,
  IconReload
} from '@tabler/icons';
import {ReactComponent as Logo} from '../assets/logo.svg';

const useStyles = createStyles((theme) => ({
    footer: {
        padding: "10px !important"
    },
    slider: {
        width: "150px"
    },
    sliderTitle: {
        fontSize: "1.2em"
    },
    hide: {
        display: "none"
    },
    input: {
      width: "40vw"
    }
  }),
);


export function FooterBar() {
  const [promptActive, setPromptActive] = useState(true);
  const [opened, setOpened] = useState(false);

  const { classes, cx } = useStyles();

  return (
    <Footer height={60} className={classes.footer} p="md" >
        <Group position="right">

            {/* <Button >
                Toggle content
            </Button> */}


            <Collapse in={opened} transitionDuration={200} transitionTimingFunction="linear">
                <Group>
                    <span className={classes.sliderTitle}> Seed: </span>
                    <Slider
                        size="lg"
                        className={classes.slider}
                        showLabelOnHover={false}
                        marks={[
                            { value: 0, label: '0' },
                            { value: 100, label: '100' },
                        ]}
                    />
                </Group>
            </Collapse>

            <Tooltip label={"Collapse"} position="top" transitionDuration={0}>
                <UnstyledButton onClick={() => setOpened((o) => !o)}>
                    {opened ? <IconChevronRight stroke={1.5} /> : <IconChevronLeft stroke={1.5} />}
                </UnstyledButton>
            </Tooltip>
            
            <Button disabled = {promptActive}>Generate</Button>
            <TextInput className={classes.input}
                placeholder="Your prompt"
                radius="md"
                size="sm"
                withAsterisk
                disabled = {promptActive}
            />
            <Tooltip label={"Collapse"} position="top" transitionDuration={0}>
                <UnstyledButton>
                    <IconReload stroke={1.5} />
                </UnstyledButton>
            </Tooltip>

            {/* <Tooltip label={label} position="right" transitionDuration={0}>
                <UnstyledButton >
                    <Icon stroke={1.5} />
                </UnstyledButton>
            </Tooltip> */}

        </Group>
    </Footer>
  );
}