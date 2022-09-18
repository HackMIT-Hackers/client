import { useState } from 'react';
import { ActionIcon, Popover, Navbar, Center, Tooltip, Group, MediaQuery, Button, TextInput, createStyles, Footer, Slider, UnstyledButton, Collapse, Container } from '@mantine/core';
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
import { IconAdjustmentsHorizontal } from '@tabler/icons';
import { useImageStore } from '../hooks/useImageStore';

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
    },
    reload: {
      '&:hover': {
        color: theme.colors.green[1]
      },
    },
    generate: {
      '&:hover': {
        color: theme.colors.green[0]
      },
    },
    action: {
      '&:hover': {
        color: theme.colors.green[0],
        backgroundColor: theme.colors.green[1]
      },
    },
  }),
);

type FooterBarProps = {
  genImage: () => void;
};

export function FooterBar({genImage}: FooterBarProps) {
  const [opened, setOpened] = useState(false);

  const { classes, cx } = useStyles();
  const [seed, updateSeed, image] = useImageStore(store => [store.seed, store.updateSeed, store.image])

  return (
    <Footer height={60} className={classes.footer} p="md" >
        <Group position="right">
            {/* <Button >
                Toggle content
            </Button> */}
            <Popover width={250} position="top" withArrow shadow="md">
              <Popover.Target>
                <ActionIcon className={classes.action}color="green.1" variant="filled">
                  <IconAdjustmentsHorizontal />
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown>
              <Group style={{marginBottom: 5}}>
                    <Tooltip label = {"Random state initializer"}>
                      <span className={classes.sliderTitle}> Seed: </span>
                    </Tooltip>
                    <Slider
                        size="md"
                        value={seed}
                        onChange={updateSeed}
                        className={classes.slider}
                        showLabelOnHover={false}
                        marks={[
                            { value: 0, label: '0' },
                            { value: 100, label: '100' },
                        ]}
                    />
                </Group>
              </Popover.Dropdown>
            </Popover>

            
            <TextInput className={classes.input}
                placeholder="Your prompt"
                radius="md"
                size="sm"
                withAsterisk
                disabled = {!image}
            />
            <Button className={classes.generate} disabled = {!image} onClick = {genImage} variant='gradient' gradient={{from: 'green.1', to: 'green.2', deg: 45}}>Generate</Button>
            <Tooltip className={classes.reload} label={"Reload"} position="top" transitionDuration={0}>
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