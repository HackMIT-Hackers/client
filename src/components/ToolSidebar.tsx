import { Navbar, Center, Tooltip, UnstyledButton, createStyles, Stack } from '@mantine/core';
import { ReactComponent as Logo } from '../assets/logo.svg';
import { tools, useToolSelect } from "../hooks/useToolSelect";
import { TablerIcon } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
  link: {
    width: 30,
    height: 30,
    padding: 5,
    borderRadius: theme.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
    },
  },

  navbar: {
    top: 0,
  },

  active: {
    '&, &:hover': {
      color: theme.colors.green[1],
    },
  },
}));

interface NavbarLinkProps {
  icon: TablerIcon;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  const { classes, cx } = useStyles();
  return (
    <Tooltip label={label} position="right" transitionDuration={0}>
      <UnstyledButton onClick={onClick} className={cx(classes.link, { [classes.active]: active })}>
        <Icon stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

export function ToolSidebar() {
  const [active, setActive] = useToolSelect((state) => [state.selectedTool, state.changeTool]);
  const { classes, cx } = useStyles();

  const links = tools.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));

  return (
    <Navbar width={{ base: 60 }} className={classes.navbar} p="md">
      <Center>
        <Logo />
      </Center>
      <Navbar.Section grow mt={80}>
        <Stack justify="center" spacing={15}>
          {links}
        </Stack>
      </Navbar.Section>
      <Navbar.Section>
        <Stack justify="center" spacing={0}>
          {/* <NavbarLink icon={IconSwitchHorizontal} label="Change account" />
          <NavbarLink icon={IconLogout} label="Logout" /> */}
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
}